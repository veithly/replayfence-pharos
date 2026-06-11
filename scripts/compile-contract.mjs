#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import solc from "solc";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const sourcePath = path.join(root, "contracts", "OnceLatchRegistry.sol");
const source = readFileSync(sourcePath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "OnceLatchRegistry.sol": {
      content: source
    }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    },
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object", "evm.deployedBytecode.object"]
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const errors = output.errors || [];
const fatal = errors.filter((err) => err.severity === "error");
for (const err of errors) {
  process.stderr.write(`${err.formattedMessage}\n`);
}
if (fatal.length) process.exit(1);

const contract = output.contracts["OnceLatchRegistry.sol"].OnceLatchRegistry;
const artifact = {
  contractName: "OnceLatchRegistry",
  sourceName: "contracts/OnceLatchRegistry.sol",
  abi: contract.abi,
  bytecode: `0x${contract.evm.bytecode.object}`,
  deployedBytecode: `0x${contract.evm.deployedBytecode.object}`,
  compiler: solc.version()
};

const outDir = path.join(root, "artifacts", "contracts");
mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "OnceLatchRegistry.json");
writeFileSync(outFile, `${JSON.stringify(artifact, null, 2)}\n`);
process.stdout.write(`${outFile}\n`);
