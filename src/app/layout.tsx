import "./globals.css";

export const metadata = {
  metadataBase: new URL("http://127.0.0.1:4387"),
  title: "ReplayFence Workbench",
  description: "OpenClaw-installable ReplayFence skill with Pharos once-latch proof evidence.",
  openGraph: {
    title: "ReplayFence",
    description: "Fence one agent action, reject the replay, export a proof capsule.",
    images: ["/brand/og.png"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
