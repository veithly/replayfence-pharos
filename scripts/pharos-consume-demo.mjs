#!/usr/bin/env node
import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createPublicClient, createWalletClient, defineChain, encodeFunctionData, http, keccak256, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { deriveLatchKey } from "../packages/replayfence-skill/src/index.mjs";
import { loadEnv, redact } from "./env.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
loadEnv(root);

const rpcUrl = process.env.PHAROS_RPC_URL || "https://atlantic.dplabs-internal.com";
const privateKey = process.env.PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY;
const registryAddress = process.env.ONCE_LATCH_REGISTRY_ADDRESS;
const args = process.argv.slice(2);
const actionPathArg = args.find((arg) => !arg.startsWith("--"));
const getArg = (name) => {
  const prefix = `--${name}=`;
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
};
const actionPath = path.resolve(actionPathArg || path.join(root, "skills/replayfence/assets/demo-action.json"));
const liveProofId =
  getArg("live-proof-id") ||
  process.env.REPLAYFENCE_LIVE_PROOF_ID ||
  `pharos-${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID().slice(0, 8)}`;

if (!privateKey || !registryAddress) {
  console.log(
    JSON.stringify(
      {
        blocked: true,
        missing: {
          PRIVATE_KEY: !privateKey,
          ONCE_LATCH_REGISTRY_ADDRESS: !registryAddress
        },
        note: "Live Pharos consume requires a funded low-value testnet key and deployed OnceLatchRegistry address. Local OpenClaw demo remains available."
      },
      null,
      2
    )
  );
  process.exit(2);
}

const abi = [
  {
    type: "function",
    name: "consume",
    stateMutability: "nonpayable",
    inputs: [
      { name: "latchKey", type: "bytes32" },
      { name: "actionHash", type: "bytes32" },
      { name: "capsuleHint", type: "bytes32" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "getLatch",
    stateMutability: "view",
    inputs: [{ name: "latchKey", type: "bytes32" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "actor", type: "address" },
          { name: "actionHash", type: "bytes32" },
          { name: "capsuleHint", type: "bytes32" },
          { name: "consumedAtBlock", type: "uint64" },
          { name: "consumedAtTimestamp", type: "uint64" }
        ]
      }
    ]
  },
  {
    type: "error",
    name: "ReplayFenceReplay",
    inputs: [
      { name: "latchKey", type: "bytes32" },
      { name: "originalActor", type: "address" },
      { name: "originalBlock", type: "uint64" }
    ]
  }
];

const pharosAtlantic = defineChain({
  id: 688689,
  name: "Pharos Atlantic Testnet",
  nativeCurrency: { name: "Pharos", symbol: "PHRS", decimals: 18 },
  rpcUrls: { default: { http: [rpcUrl] } },
  blockExplorers: {
    default: { name: "PharosScan", url: "https://atlantic.pharosscan.xyz" }
  }
});

const baseAction = JSON.parse(readFileSync(actionPath, "utf8"));
const action = {
  ...baseAction,
  pharosLiveProof: {
    ...(baseAction.pharosLiveProof || {}),
    proofId: liveProofId,
    registryAddress,
    chainId: 688689
  }
};
const derived = deriveLatchKey({ action, chainId: 688689, registryAddress });
const capsuleHint = keccak256(toHex(`ReplayFence:${derived.latchKey}:${liveProofId}`));
const account = privateKeyToAccount(privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`);
const publicClient = createPublicClient({ chain: pharosAtlantic, transport: http(rpcUrl) });
const walletClient = createWalletClient({ account, chain: pharosAtlantic, transport: http(rpcUrl) });
const consumeData = encodeFunctionData({
  abi,
  functionName: "consume",
  args: [derived.latchKey, derived.actionHash, capsuleHint]
});
const replayErrorSelector = "0xabbf726f";

function decodeReplayFenceReplay(data) {
  if (!data?.startsWith(replayErrorSelector)) return undefined;
  const encoded = data.slice(10);
  const latchKey = `0x${encoded.slice(0, 64)}`;
  const actorWord = encoded.slice(64, 128);
  const blockWord = encoded.slice(128, 192);
  return {
    customError: "ReplayFenceReplay",
    selector: replayErrorSelector,
    latchKey,
    originalActor: redact(`0x${actorWord.slice(24)}`),
    originalBlock: BigInt(`0x${blockWord}`).toString()
  };
}

function normalizeRpcError(error) {
  return {
    code: error?.code,
    message: error?.message,
    data: error?.data,
    decoded: decodeReplayFenceReplay(error?.data)
  };
}

async function rpcRequest(method, params) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params })
  });
  return response.json();
}

async function simulateReplay() {
  const response = await rpcRequest("eth_call", [
    { from: account.address, to: registryAddress, data: consumeData },
    "latest"
  ]);
  if (response.error) {
    return {
      status: "REPLAY_REJECTED",
      rejectionSurface: "eth_call",
      rpcError: normalizeRpcError(response.error)
    };
  }
  return {
    status: "UNEXPECTED_REPLAY_ACCEPTED",
    rejectionSurface: "eth_call",
    result: response.result
  };
}

async function sendReplayTransaction(replayGas) {
  const nonce = await publicClient.getTransactionCount({
    address: account.address,
    blockTag: "pending"
  });
  const gasPrice = await publicClient.getGasPrice();
  const signedTransaction = await account.signTransaction({
    chainId: pharosAtlantic.id,
    type: "legacy",
    to: registryAddress,
    data: consumeData,
    nonce,
    gas: replayGas || 300000n,
    gasPrice
  });
  const response = await rpcRequest("eth_sendRawTransaction", [signedTransaction]);
  if (response.error) {
    return {
      status: "REPLAY_REJECTED",
      rejectionSurface: "eth_sendRawTransaction",
      rpcError: normalizeRpcError(response.error)
    };
  }
  const replayHash = response.result;
  const replayReceipt = await publicClient.waitForTransactionReceipt({ hash: replayHash });
  return {
    status: replayReceipt.status === "reverted" ? "REPLAY_REJECTED" : "UNEXPECTED_REPLAY_ACCEPTED",
    txHash: replayHash,
    blockNumber: replayReceipt.blockNumber.toString(),
    receiptStatus: replayReceipt.status,
    explorer: `https://atlantic.pharosscan.xyz/tx/${replayHash}`
  };
}

const request = await publicClient.prepareTransactionRequest({
  account,
  to: registryAddress,
  data: consumeData
});

const gas = request.gas ? (request.gas * 120n) / 100n : undefined;
const hash = await walletClient.sendTransaction({ ...request, gas });
const receipt = await publicClient.waitForTransactionReceipt({ hash });
const replaySimulation = await simulateReplay();
const replayTransaction = await sendReplayTransaction(gas);
const replayAttempt = {
  status:
    replaySimulation.status === "REPLAY_REJECTED" &&
    replayTransaction.status === "REPLAY_REJECTED"
      ? "REPLAY_REJECTED"
      : "NEEDS_REVIEW",
  note: "Replay attempt reused the exact same latchKey/actionHash/capsuleHint after the first live consume.",
  simulation: replaySimulation,
  transaction: replayTransaction
};

const latchRecord = await publicClient.readContract({
  address: registryAddress,
  abi,
  functionName: "getLatch",
  args: [derived.latchKey]
});

const report = {
  schema: "replayfence.pharos.consume.v1",
  status: replayAttempt.status === "REPLAY_REJECTED" ? "CONSUMED_AND_REPLAY_REJECTED" : "NEEDS_REVIEW",
  chainId: 688689,
  actor: redact(account.address),
  registryAddress,
  actionSource: path.relative(root, actionPath),
  liveProofId,
  latchKey: derived.latchKey,
  actionHash: derived.actionHash,
  capsuleHint,
  firstConsume: {
    status: receipt.status === "success" ? "CONSUMED" : "NEEDS_REVIEW",
    txHash: hash,
    blockNumber: receipt.blockNumber.toString(),
    receiptStatus: receipt.status,
    explorer: `https://atlantic.pharosscan.xyz/tx/${hash}`
  },
  replayAttempt,
  onchainLatch: {
    actor: redact(latchRecord.actor),
    actionHash: latchRecord.actionHash,
    capsuleHint: latchRecord.capsuleHint,
    consumedAtBlock: latchRecord.consumedAtBlock.toString(),
    consumedAtTimestamp: latchRecord.consumedAtTimestamp.toString()
  }
};
writeFileSync(path.join(root, "demo", "pharos-consume-report.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
