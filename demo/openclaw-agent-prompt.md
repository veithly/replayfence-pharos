# OpenClaw Agent Prompt: ReplayFence Skill Demo

You are running inside OpenClaw as the `main` agent.

Use the installed `replayfence` skill, not a hand-written replacement. The skill is visible at:

`/Users/rick/.openclaw/workspace/skills/replayfence/SKILL.md`

Do not read, print, or summarize any private keys or API keys. Do not inspect `$HOME/use_key.txt`.

Goal: prove that a normal OpenClaw agent can use the installed ReplayFence skill from a prompt.

Please do the following:

1. Inspect the installed `replayfence` skill instructions enough to know its command workflow.
2. Run the bundled ReplayFence demo from the installed OpenClaw skill copy, writing artifacts into `/Users/rick/Documents/Project/Hackathon/Pharos/demo/`:

```bash
node /Users/rick/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs demo --reset --format pretty --out /Users/rick/Documents/Project/Hackathon/Pharos/demo/openclaw-agent-replayfence-capsule.json --transcript /Users/rick/Documents/Project/Hackathon/Pharos/demo/openclaw-agent-skill-showcase.out --json-out /Users/rick/Documents/Project/Hackathon/Pharos/demo/openclaw-agent-demo-output.json --pharos-report /Users/rick/Documents/Project/Hackathon/Pharos/demo/pharos-consume-report.json
```

3. Verify the generated capsule:

```bash
node /Users/rick/.openclaw/workspace/skills/replayfence/scripts/replayfence.mjs verify --capsule /Users/rick/Documents/Project/Hackathon/Pharos/demo/openclaw-agent-replayfence-capsule.json --format pretty --json-out /Users/rick/Documents/Project/Hackathon/Pharos/demo/openclaw-agent-verify-output.json
```

4. Return a concise result with:
   - the model/provider claim only if OpenClaw metadata supplies it;
   - capsule path;
   - first attempt status;
   - replay attempt status;
   - verifier status;
   - the honesty boundary: the terminal run is `local-demo`; the Pharos report is separately recorded live evidence if present.

If a command fails, report the exact failing command and error instead of fabricating success.
