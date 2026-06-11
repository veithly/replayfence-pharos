# Visual Build Contract: ReplayFence

## Source inputs

- PRD: `pitch/project_prd.md` § 9-11
- Mockups: `docs/ui-mockups/01-hero-frame.png`, `docs/ui-mockups/02-app-frame.png`, `docs/ui-mockups/03-mobile-first-run.png`
- gpt-taste pass:

```xml
<design_plan>
Python RNG Execution:
seed = len("ReplayFence OpenClaw installable Pharos once-latch proof capsule") % 97 = 66
hero_architecture = "Artistic Asymmetry"; typography = "Geist + JetBrains Mono"; components = ["terminal proof rail", "state-machine triptych", "capsule anatomy panel"]; motion = ["scrubbed status reveal", "card stacking"]
AIDA Check: Navigation, Attention hero, Interest state/capsule grid, Desire proof/capsule reveal, Action install/run command are present.
Hero Math Verification: H1 uses max-w-6xl and compact copy so the desktop line count stays 2-3 lines. No stamp icons or spam tags.
Bento Density Verification: no decorative bento grid in P0; product workbench uses explicit three-column grid with no empty cells.
Label Sweep & Button Check: no QUESTION/SECTION labels; primary buttons use saturated fills with readable text.
</design_plan>
```

- impeccable pass: setup found `NO_PRODUCT_MD`, so `PRODUCT.md` was created from project evidence. Register is `product`. Physical scene: "security engineer at a dim laptop during a live demo, verifying whether an agent replay actually got blocked." Color strategy is restrained product UI with OKLCH dark neutral surface, Pharos cyan/green success, amber warning, and coral-red rejection. Typography uses one UI sans plus mono for proof data. Audit notes: avoid decorative motion, cards-within-cards, ghost shadows, gradient text, and generic crypto dashboards.

## Visual lane

- Lane: operational-dashboard / cyberpunk-terminal hybrid.
- Why this lane fits: the product is a reusable safety skill with proof objects and command transcript evidence.
- Design anchor / recipe: OpenClaw install transcript on the left, latch state timeline in the center, proof capsule anatomy on the right.
- Four positioning answers:
  - Narrative role: proof workbench, not marketing hero.
  - Viewing distance: laptop and projector; text must remain legible in a demo recording.
  - Visual temperature: authoritative, quiet, high-trust, tense only at replay rejection.
  - Capacity check: first screen shows one action, one command, one latch timeline, one capsule preview.
- Non-Tailwind visual signature: `data-visual-lane="operational-dashboard"`, command transcript rail, latch-state cockpit, mono hash panels, rejection shock band.
- Forbidden defaults: default Next.js starter, generic Tailwind SaaS cards, unmodified shadcn dashboard, unrelated premium gradients, AI chat interface.

## Component-system lock

- Primary UI library: shadcn/ui with Radix primitives.
- Supporting UI library: xterm-monaco proof/code panels plus lucide-react.
- Why this library fits the lane: standard accessible controls plus a real code/terminal proof surface for OpenClaw install evidence.
- Components used on screen: Button, Tabs, Dialog, Toast/Sonner, Table, ScrollArea, Monaco/terminal panel, HexCopy.
- Official docs checked: OpenClaw CLI help, shadcn/ui, Radix UI, xterm, Monaco, lucide, viem, Hardhat.
- Install commands: `npx create-next-app@latest`, `npm install viem zod lucide-react @radix-ui/react-tabs @radix-ui/react-dialog monaco-editor @xterm/xterm`, `npm install -D hardhat @nomicfoundation/hardhat-toolbox playwright`.
- Tailwind role: utility substrate only, not the visual system.
- Rejection note: custom state machine, command transcript, and proof rail make this more than a Tailwind-only or shadcn-only surface.

## Generated cutout assets

- Raw prompts: `public/art/briefs/*.md` or not used in P0 if command/proof UI carries the identity.
- Raw generations: `public/art/raw/*.png` optional for deck plates.
- Cutout command: `node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/cutout_assets.mjs public/art/raw --out public/art/cutouts --brief-dir public/art/briefs --usage "ReplayFence app proof plates" --auto-key --trim`
- Cutout manifest: `public/art/cutouts/cutout-manifest.json`
- UI usage map: optional deck/proof plates only; product UI does not depend on generated character art.

## Route and component map

| Route | Mockup source | Hero/user-case beat | Components | Source marker |
|---|---|---|---|---|
| `/` | `docs/ui-mockups/01-hero-frame.png` | judge sees action, replay, capsule | HeroPanel, ChainBadge, ProofCapsuleTeaser | `data-visual-lane="operational-dashboard" data-hero-composition="control-room-triptych"` |
| `/try` | `docs/ui-mockups/02-app-frame.png` | first consume and replay rejection | ActionFencePanel, LatchTimeline, CapsulePreview | `data-visual-lane="operational-dashboard"` |
| `/openclaw-demo` | `docs/ui-mockups/02-app-frame.png` | install transcript proves generic runtime | CommandTranscript, SkillStatusPanel, CapsulePreview | `data-hero-composition="openclaw-command-rail"` |
| `/capsules/[capsuleId]` | `docs/ui-mockups/02-app-frame.png` | proof detail and export | ProofCapsuleInspector, ProofChecklist | `data-visual-lane="operational-dashboard"` |
| mobile QR | `docs/ui-mockups/03-mobile-first-run.png` | two-tap first action | MobileActionCard, StickyRunButton | `data-visual-lane="operational-dashboard"` |

## Desktop and mobile compositions

- Desktop 1920x1200: three-column workbench with command/action, latch timeline, and capsule/proof panel.
- Mobile 390x844: action card first, timeline second, capsule third, sticky primary CTA.
- Touch-first action path: Try as Guest -> Fence + Execute Once -> Replay Same Action -> Inspect Capsule.
- Desktop parity detail: command transcript, copy buttons, tx/proof links, and route navigation stay visible.

## Layout and motion math

- H1 width and line-limit check: max width equivalent to `max-w-6xl`; headline copy stays under three lines.
- Bento grid math, if used: P0 uses fixed three-panel grid, no bento voids.
- AIDA coverage for `/`: Attention hero, Interest action state, Desire proof capsule, Action OpenClaw install/run.
- GSAP / motion implementation: state transitions only; no decorative page-load choreography.
- Reduced-motion fallback: instant state changes and non-animated skeletons.
- CTA contrast check: saturated success/replay buttons use near-black or near-white text depending on luminance.
- Cheap-label sweep: no "SECTION 01", "QUESTION", or repeated uppercase eyebrows.

## V0 anchor and critique

- V0 anchor artefact: `docs/ui-mockups/02-app-frame.png`
- Five-dimension critique: philosophy 8.5/10, hierarchy 8/10, craft 8/10, functionality 8.5/10, originality 8/10
- Overall score: 8.2/10
- Fixes applied before full build: shifted from custom-agent story to OpenClaw install transcript; kept proof capsule and Pharos state as the visible outcome.

## Implementation checks

- Top product shell has `data-visual-lane="operational-dashboard"`.
- Top hero/app surface has `data-hero-composition="control-room-triptych"` or `openclaw-command-rail`.
- Default starter copy/assets are deleted.
- Brand pack appears in nav, favicon, OG, deck corner, and demo lower-third.
- `node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/audit_project.mjs . --phase ui-libs` must pass before feature recording.
