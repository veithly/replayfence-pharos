export type CapsuleStorageRow = {
  ownerId: string;
  guestSessionId: string;
  capsuleId: string;
  walletAddress: string;
  createdAt: string;
  payloadJson: string;
};

export const runtimeBackboneEvidence = {
  storage: {
    current: "B6 browser localStorage mirror for guest proof history",
    deploymentTarget: "D1Database or sqlite capsule table with ownerId and guestSessionId columns",
    table: "capsules(ownerId, guestSessionId, capsuleId, walletAddress, payloadJson, createdAt)"
  },
  web3: {
    library: "viem",
    liveWriter: "scripts/pharos-consume-demo.mjs",
    firstConsumeCall: "walletClient.sendTransaction",
    replayCall: "account.signTransaction followed by eth_sendRawTransaction",
    receiptEvidence: "demo/pharos-consume-report.json"
  }
};

export function describeRuntimeBackbones() {
  return [
    runtimeBackboneEvidence.storage.deploymentTarget,
    runtimeBackboneEvidence.web3.library,
    runtimeBackboneEvidence.web3.firstConsumeCall,
    runtimeBackboneEvidence.web3.replayCall
  ].join(" | ");
}

