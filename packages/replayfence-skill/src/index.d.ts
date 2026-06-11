export type ReplayFenceAction = Record<string, unknown>;

export type DerivedLatch = {
  canonicalJson: unknown;
  canonicalString: string;
  canonicalHashSha256: `0x${string}`;
  actorScope: string;
  toolId: string;
  chainId: number;
  registryAddress: `0x${string}`;
  actionHash: `0x${string}`;
  latchKey: `0x${string}`;
};

export type ReplayFenceCapsule = {
  schema: "replayfence.capsule.v1";
  capsuleId: string;
  createdAt: string;
  environment: string;
  action: {
    label: string;
    toolId: string;
    actorScope: string;
    canonicalJson: unknown;
    canonicalHashSha256: `0x${string}`;
    actionHash: `0x${string}`;
  };
  latch: {
    chainId: number;
    registryAddress: `0x${string}`;
    latchKey: `0x${string}`;
    status: string;
  };
  attempts?: unknown;
  proof?: unknown;
  safety: {
    environment: string;
    actionMode: string;
    disclaimer: string;
  };
};

export function canonicalizeAction(action: ReplayFenceAction): {
  canonicalJson: unknown;
  canonicalString: string;
  canonicalHashSha256: `0x${string}`;
};

export function deriveLatchKey(input: {
  action: ReplayFenceAction;
  chainId?: number;
  registryAddress?: `0x${string}`;
}): DerivedLatch;

export function createCapsule(input: {
  action: ReplayFenceAction;
  latch: {
    chainId: number;
    registryAddress: `0x${string}`;
    status: string;
    environment?: string;
  };
  attempts?: unknown;
  proof?: unknown;
}): ReplayFenceCapsule;

export function verifyReplayFenceCapsule(capsule: ReplayFenceCapsule): {
  ok: boolean;
  checks: Record<string, boolean>;
  derived: DerivedLatch;
};
