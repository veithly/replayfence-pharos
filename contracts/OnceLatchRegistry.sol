// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OnceLatchRegistry {
    struct LatchRecord {
        address actor;
        bytes32 actionHash;
        bytes32 capsuleHint;
        uint64 consumedAtBlock;
        uint64 consumedAtTimestamp;
    }

    mapping(bytes32 => LatchRecord) public latches;

    event LatchConsumed(
        bytes32 indexed latchKey,
        address indexed actor,
        bytes32 indexed actionHash,
        bytes32 capsuleHint,
        uint64 consumedAtBlock
    );

    error ReplayFenceReplay(
        bytes32 latchKey,
        address originalActor,
        uint64 originalBlock
    );

    function consume(
        bytes32 latchKey,
        bytes32 actionHash,
        bytes32 capsuleHint
    ) external {
        LatchRecord memory existing = latches[latchKey];
        if (existing.consumedAtBlock != 0) {
            revert ReplayFenceReplay(
                latchKey,
                existing.actor,
                existing.consumedAtBlock
            );
        }

        latches[latchKey] = LatchRecord({
            actor: msg.sender,
            actionHash: actionHash,
            capsuleHint: capsuleHint,
            consumedAtBlock: uint64(block.number),
            consumedAtTimestamp: uint64(block.timestamp)
        });

        emit LatchConsumed(
            latchKey,
            msg.sender,
            actionHash,
            capsuleHint,
            uint64(block.number)
        );
    }

    function isConsumed(bytes32 latchKey) external view returns (bool) {
        return latches[latchKey].consumedAtBlock != 0;
    }

    function getLatch(bytes32 latchKey) external view returns (LatchRecord memory) {
        return latches[latchKey];
    }
}
