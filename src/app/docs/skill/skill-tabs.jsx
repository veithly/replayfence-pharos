"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { CopyButton } from "@/components/copy-button";

export function SkillTabs({ snippets }) {
  return (
    <Tabs.Root defaultValue="install" className="docs-tabs">
      <Tabs.List className="tabs-list" aria-label="Skill documentation sections">
        <Tabs.Trigger value="install">Install</Tabs.Trigger>
        <Tabs.Trigger value="sdk">SDK</Tabs.Trigger>
        <Tabs.Trigger value="contract">Contract</Tabs.Trigger>
      </Tabs.List>
      {Object.entries(snippets).map(([key, snippet]) => (
        <Tabs.Content key={key} value={key} className="docs-panel">
          <div className="panel-title">
            <span>{snippet.title}</span>
            <CopyButton value={snippet.code} label={`Copy ${snippet.title}`} />
          </div>
          <pre className="json-panel" data-testid={key === "sdk" ? "sdk-snippet" : undefined}>
            {snippet.code}
          </pre>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

