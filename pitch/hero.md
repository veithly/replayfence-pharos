# Hero

## Canonical One-Line Hook

ReplayFence blocks duplicate agent actions on Pharos in 60 seconds.

## Hero Copy

Fence one agent action in 60 seconds, reject the replay, and export a proof capsule.

## 5-Second Explanation

Agents retry when networks blink. ReplayFence gives each high-stakes action one public Pharos latch, so the first call executes and the duplicate returns proof instead of causing damage.

## 30-Second Entry

A fresh judge opens the app, chooses a seeded action such as “release demo payment,” then clicks `Run once`.

## 60-Second Visible Consequence

The first call writes a latch on Pharos Atlantic. The second call with the same canonical intent is rejected as a duplicate. The app saves a ReplayFence Capsule with the original tx, duplicate attempt, verifier result, and proof trace.

## 5-Minute Proof

The judge can inspect the Skill manifest, replay the same call through the API, download `replayfence-capsule.json`, and verify the action hash / latch state without trusting the UI.

## Tagline

Exactly-once proof for agent actions.
