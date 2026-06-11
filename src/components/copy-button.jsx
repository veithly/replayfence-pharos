"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ value, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button className="icon-button" type="button" onClick={copyValue} aria-label={label} title={label}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

