#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createPublicClient, createWalletClient, defineChain, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { loadEnv, redact } from "./env.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
loadEnv(root);

const rpcUrl = process.env.PHAROS_RPC_URL || "https://atlantic.dplabs-internal.com";
const privateKey = process.env.PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY;
const artifactPath = path.join(root, "artifacts", "contracts", "OnceLatchRegistry.json");

if (!privateKey) {
  console.error("BLOCKED: PRIVATE_KEY is required to deploy OnceLatchRegistry to Pharos Atlantic.");
  process.exit(2);
}
if (!existsSync(artifactPath)) {
  console.error("BLOCKED: contract artifact missing. Run npm run contract:compile first.");
  process.exit(2);
}

const pharosAtlantic = defineChain({
  id: 688689,
  name: "Pharos Atlantic Testnet",
  nativeCurrency: { name: "Pharos", symbol: "PHRS", decimals: 18 },
  rpcUrls: { default: { http: [rpcUrl] } },
  blockExplorers: {
    default: { name: "PharosScan", url: "https://atlantic.pharosscan.xyz" }
  }
});

const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
const account = privateKeyToAccount(privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`);
const publicClient = createPublicClient({ chain: pharosAtlantic, transport: http(rpcUrl) });
const walletClient = createWalletClient({ account, chain: pharosAtlantic, transport: http(rpcUrl) });

const reportPath = path.join(root, "demo", "pharos-deploy-report.json");
mkdirSync(path.dirname(reportPath), { recursive: true });

try {
  console.log(JSON.stringify({ status: "deploying", chainId: pharosAtlantic.id, account: redact(account.address) }, null, 2));
  const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    account
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const report = {
    status: "deployed",
    chainId: pharosAtlantic.id,
    txHash: hash,
    contractAddress: receipt.contractAddress,
    explorer: `https://atlantic.pharosscan.xyz/tx/${hash}`
  };
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  const report = {
    status: "blocked",
    stage: "deploy",
    chainId: pharosAtlantic.id,
    account: redact(account.address),
    reason: error.shortMessage || error.message || "Unknown deployment failure",
    details: error.details || "",
    next_action:
      "Use a funded/accepted low-value Pharos Atlantic deployer key, then rerun npm run contract:deploy:pharos."
  };
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  process.exit(2);
}
