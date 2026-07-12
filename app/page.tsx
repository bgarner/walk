"use client";

import { FormEvent, useEffect, useState } from "react";
import WalkingMap from "./walking-map";

type StepEntry = {
  id: number;
  name: string;
  steps: number;
  created_at: string;
};

type Leader = {
  name: string;
  steps: number;
  entries: number;
};

type EntryUnit = "steps" | "km";

function formatDistance(steps: number) {
  if (steps < 1000) {
    return `${steps.toLocaleString()} m`;
  }

  return `${(steps / 1000).toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })} km`;
}

function participantCount(entries: StepEntry[]) {
  return new Set(entries.map((entry) => entry.name.toLowerCase())).size;
}

function buildLeaders(entries: StepEntry[]): Leader[] {
  const leaders = new Map<string, Leader>();

  entries.forEach((entry) => {
    const key = entry.name.trim().toLowerCase();
    const current = leaders.get(key);

    if (current) {
      current.steps += entry.steps;
      current.entries += 1;
      return;
    }

    leaders.set(key, {
      name: entry.name,
      steps: entry.steps,
      entries: 1,
    });
  });

  return [...leaders.values()]
    .sort((a, b) => b.steps - a.steps || a.name.localeCompare(b.name))
    .slice(0, 10);
}

function addEntryToLeaders(leaders: Leader[], entry: StepEntry): Leader[] {
  const key = entry.name.trim().toLowerCase();
  const next = new Map<string, Leader>();

  leaders.forEach((leader) => {
    next.set(leader.name.trim().toLowerCase(), { ...leader });
  });

  const current = next.get(key);
  if (current) {
    current.steps += entry.steps;
    current.entries += 1;
  } else {
    next.set(key, {
      name: entry.name,
      steps: entry.steps,
      entries: 1,
    });
  }

  return [...next.values()]
    .sort((a, b) => b.steps - a.steps || a.name.localeCompare(b.name))
    .slice(0, 10);
}

function amountToSteps(amount: string, unit: EntryUnit) {
  const value = Number(amount);

  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  if (unit === "steps") {
    return Number.isInteger(value) ? value : null;
  }

  return Math.round(value * 1000);
}

export default function Home() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [entryUnit, setEntryUnit] = useState<EntryUnit>("steps");
  const [totalSteps, setTotalSteps] = useState(0);
  const [entries, setEntries] = useState<StepEntry[]>([]);
  const [serverLeaders, setServerLeaders] = useState<Leader[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadEntries() {
      try {
        const response = await fetch("/api/steps", { cache: "no-store" });
        if (!response.ok) throw new Error("No shared data");
        const data = await response.json();
        setEntries(data.entries ?? []);
        setServerLeaders(data.leaders ?? []);
        setTotalSteps(data.totalSteps ?? 0);
      } catch {
        const local = JSON.parse(localStorage.getItem("walk-entries") ?? "[]");
        setEntries(local);
        setServerLeaders([]);
        setTotalSteps(local.reduce((sum: number, item: StepEntry) => sum + item.steps, 0));
      }
    }

    loadEntries();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanSteps = amountToSteps(amount, entryUnit);

    if (!name.trim() || cleanSteps === null || cleanSteps <= 0) {
      setMessage(
        entryUnit === "steps"
          ? "Add a name and a whole number of steps."
          : "Add a name and a distance greater than 0 km.",
      );
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, steps: cleanSteps }),
      });

      if (!response.ok) throw new Error("Shared save failed");

      const data = await response.json();
      const newEntry: StepEntry = {
        id: Date.now(),
        name: name.trim(),
        steps: cleanSteps,
        created_at: new Date().toISOString(),
      };
      setEntries((current) => [newEntry, ...current].slice(0, 25));
      setServerLeaders((current) => addEntryToLeaders(current, newEntry));
      setTotalSteps(data.totalSteps ?? totalSteps + cleanSteps);
      setName("");
      setAmount("");
      setMessage("Steps added to the group walk.");
    } catch {
      const newEntry: StepEntry = {
        id: Date.now(),
        name: name.trim(),
        steps: cleanSteps,
        created_at: new Date().toISOString(),
      };
      const nextEntries = [newEntry, ...entries].slice(0, 25);
      localStorage.setItem("walk-entries", JSON.stringify(nextEntries));
      setEntries(nextEntries);
      setServerLeaders([]);
      setTotalSteps(nextEntries.reduce((sum, item) => sum + item.steps, 0));
      setMessage("Steps added to the group walk.");
    } finally {
      setSaving(false);
    }
  }

  const leaders = serverLeaders.length > 0 ? serverLeaders : buildLeaders(entries);
  const people = participantCount(entries);

  return (
    <>
      <nav className="site-nav">
        <a className="brand" href="#top" aria-label="Walk Around The World home">
          <span className="brand-mark">🌍</span>
          <span>Walk Around The World</span>
        </a>
      </nav>

      <main id="top" className="page">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">Join the voyage</span>
            <h1>
              One Small Step for You,{" "}
              <span>One Giant Walk</span> for the East Lake Ward.
            </h1>
            <p>
              We&apos;re walking from Airdrie, Alberta across the world, one
              collective step at a time. Put on your shoes and add your steps to
              the shared journey.
            </p>

            <div className="total-card">
              <span className="card-label">Collective Total Steps</span>
              <strong>{totalSteps.toLocaleString()}</strong>
              <small>{formatDistance(totalSteps)} covered together</small>
            </div>

          </div>

          <div id="log-steps" className="log-card">
            <div>
              <span className="card-label">East Lake Ward starts here</span>
              <h2>Log Your Steps</h2>
              <p>Add today&apos;s walk to the collective voyage.</p>
            </div>

            <form className="step-form" onSubmit={handleSubmit}>
              <label>
                Your Nickname
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={40}
                  placeholder="e.g. Speedster Jane"
                />
              </label>

              <div className="unit-toggle" aria-label="Choose entry type">
                <button
                  type="button"
                  className={entryUnit === "steps" ? "active" : ""}
                  onClick={() => setEntryUnit("steps")}
                >
                  Steps
                </button>
                <button
                  type="button"
                  className={entryUnit === "km" ? "active" : ""}
                  onClick={() => setEntryUnit("km")}
                >
                  Kilometers
                </button>
              </div>

              <label>
                {entryUnit === "steps" ? "Steps Walked Today" : "Distance Walked Today"}
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  inputMode="decimal"
                  pattern={entryUnit === "steps" ? "[0-9]*" : "[0-9]*[.]?[0-9]*"}
                  placeholder={entryUnit === "steps" ? "e.g. 10000" : "e.g. 3.5 km"}
                />
              </label>
              {entryUnit === "km" && amountToSteps(amount, entryUnit) !== null && (
                <p className="conversion-note">
                  {Number(amount).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  km = {amountToSteps(amount, entryUnit)?.toLocaleString()} steps
                </p>
              )}
              <button type="submit" disabled={saving}>
                {saving ? "Adding..." : "Submit Steps"}
              </button>
            </form>

            {message && <p className="message">{message}</p>}
          </div>
        </section>

        <section id="global-path" className="progress-section">
          <div className="section-heading">
            <h2>Our progress</h2>
            <p>Track our collective progress across continents.</p>
          </div>

          <div className="map-panel">
            <WalkingMap totalSteps={totalSteps} />
            <p className="map-credit">
              Map data &copy;{" "}
              <a href="https://www.openstreetmap.org/copyright">
                OpenStreetMap
              </a>{" "}
              contributors
            </p>
          </div>

          <div className="progress-cards">
            <article className="metric-card">
              <span className="metric-icon blue">🌐</span>
              <strong>{formatDistance(totalSteps)}</strong>
              <p>Distance covered since we started our journey in Airdrie.</p>
            </article>
            <article className="metric-card">
              <span className="metric-icon green">👥</span>
              <strong>{people.toLocaleString()} Walkers</strong>
              <p>Enthusiastic ward members contributing their daily steps.</p>
            </article>
          </div>
        </section>

        <section className="leaders-section">
          <div className="section-heading">
            <h2>Step Leaders</h2>
          </div>

          <div className="leaders-panel">
            <div className="leaders-header">
              <h3>🏆 Top Steppers</h3>
              <span>{entries.length.toLocaleString()} entries</span>
            </div>

            {leaders.length > 0 ? (
              <ol className="leader-list">
                {leaders.slice(0, 5).map((entry, index) => (
                  <li key={entry.name.toLowerCase()}>
                    <span className="rank">{index + 1}</span>
                    <span className="avatar">{entry.name.charAt(0).toUpperCase()}</span>
                    <span className="leader-name">{entry.name}</span>
                    <strong>{entry.steps.toLocaleString()} steps</strong>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="empty-state">
                No steps logged yet. Be the first explorer on the board.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
