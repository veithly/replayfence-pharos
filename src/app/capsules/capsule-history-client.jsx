"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { CapsuleSummary, EmptyState, StatusPill } from "@/components/workbench";

const historyKey = "replayfence.capsule.history.v1";

function readStoredCapsules() {
  try {
    return JSON.parse(window.localStorage.getItem(historyKey) || "[]");
  } catch {
    return [];
  }
}

export function CapsuleHistoryClient({ seededCapsules }) {
  const [storedCapsules, setStoredCapsules] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setStoredCapsules(readStoredCapsules());
  }, []);

  const capsules = useMemo(() => {
    const byId = new Map();
    [...storedCapsules, ...seededCapsules].forEach((capsule) => {
      if (capsule?.capsuleId && !byId.has(capsule.capsuleId)) byId.set(capsule.capsuleId, capsule);
    });
    return [...byId.values()].filter((capsule) => {
      if (filter === "all") return true;
      return capsule.environment === filter;
    });
  }, [filter, seededCapsules, storedCapsules]);

  function refresh() {
    setStoredCapsules(readStoredCapsules());
  }

  function clearLocalHistory() {
    window.localStorage.removeItem(historyKey);
    setStoredCapsules([]);
  }

  return (
    <>
      <section className="panel">
        <div className="panel-title">
          <span>Guest history mirror</span>
        </div>
        <div className="history-toolbar">
          <StatusPill status={`${capsules.length} capsule records`} tone="success" />
          {["all", "pharos-atlantic", "local-demo"].map((item) => (
            <button
              key={item}
              className={filter === item ? "secondary-button active-filter" : "secondary-button"}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
          <button className="secondary-button" type="button" onClick={refresh}>
            <RotateCcw size={16} /> Refresh
          </button>
          <button className="secondary-button" type="button" onClick={clearLocalHistory}>
            <Trash2 size={16} /> Clear guest mirror
          </button>
        </div>
        <p className="history-note">
          Seeded evidence ships with the app. Guest-owned records created in /try are mirrored in localStorage under
          <code> replayfence.capsule.history.v1</code> with ownerId and guestSessionId fields.
        </p>
      </section>

      {capsules.length ? (
        <section className="capsule-grid" data-testid="capsule-history-list">
          {capsules.map((capsule) => (
            <CapsuleSummary
              key={capsule.capsuleId}
              capsule={capsule}
              href={`/capsules/${capsule.capsuleId}`}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No capsules yet"
          body="Fence the seeded action from the Try page, then return here to reopen the saved proof."
          href="/try"
          action="Open try page"
        />
      )}
    </>
  );
}

