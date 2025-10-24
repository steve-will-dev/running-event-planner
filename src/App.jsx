import React, { useEffect, useState } from "react";

export default function App() {
  const STORAGE_KEY = "marathon_tracker_events_v1";
  const defaultEvents = [
    {
      id: "london-2026",
      name: "London Marathon",
      location: "London, UK",
      type: "Major",
      opens: "2025-04-25",
      closes: "2025-05-02",
      notes: "Public ballot: opened Apr 25 2025, closed May 2 2025. Results emailed mid-June 2025; successful entrants had until 10 Jul 2025 to register & pay."
    },
    {
      id: "berlin-2026",
      name: "Berlin Marathon",
      location: "Berlin, DE",
      type: "Major",
      opens: "2025-09-25",
      closes: "2025-11-06",
      notes: "Lottery registration for 2026 entries: Sep 25 – Nov 6, 2025 (official SCC/Berlin site)."
    },
    {
      id: "chicago-2026",
      name: "Chicago Marathon",
      location: "Chicago, USA",
      type: "Major",
      opens: "2025-10-21",
      closes: "2025-11-18",
      notes: "Application window for 2026 (guaranteed & non-guaranteed) opened Oct 21, 2025 and closed Nov 18, 2025 (Chicago Marathon official site)."
    },
    {
      id: "tokyo-2026",
      name: "Tokyo Marathon",
      location: "Tokyo, JP",
      type: "Major",
      opens: "2025-08-15",
      closes: "2025-08-29",
      notes: "Entry period for Tokyo Marathon 2026: Aug 15–29, 2025 (official Tokyo Marathon site)."
    },
    {
      id: "newyork-2026",
      name: "New York City Marathon",
      location: "New York, USA",
      type: "Major",
      opens: "2025-02-11",
      closes: "2025-02-25",
      notes: "Non-guaranteed entry drawing for 2025 was open Feb 11–25, 2025; dates vary by year—check NYRR for 2026 schedule."
    },
    {
      id: "boston-2026",
      name: "Boston Marathon (qualifier registration)",
      location: "Boston, USA",
      type: "Major",
      opens: "2025-09-08",
      closes: "2025-09-12",
      notes: "Qualifier registration for 2026 took place Sep 8–12, 2025 (BAA official)."
    },
    {
      id: "lisbon-half-2025",
      name: "Lisbon Half (SuperHalfs)",
      location: "Lisbon, PT",
      type: "SuperHalf",
      opens: "2025-02-01",
      closes: "2025-03-09",
      notes: "Event date Mar 9, 2025; registration windows vary—check race site."
    },
    {
      id: "prague-half-2025",
      name: "Prague Half (SuperHalfs)",
      location: "Prague, CZ",
      type: "SuperHalf",
      opens: "2025-03-01",
      closes: "2025-04-05",
      notes: "Event date Apr 5, 2025; registration windows vary—check race site."
    },
    {
      id: "copenhagen-half-2025",
      name: "Copenhagen Half (SuperHalfs)",
      location: "Copenhagen, DK",
      type: "SuperHalf",
      opens: "2025-02-01",
      closes: "2025-08-15",
      notes: "Registration windows vary—confirm on SuperHalfs/race site."
    },
    {
      id: "valencia-half-2025",
      name: "Valencia Half (SuperHalfs)",
      location: "Valencia, ES",
      type: "SuperHalf",
      opens: "2025-04-01",
      closes: "2025-09-01",
      notes: "Event date and registration vary—check race site."
    }
  ];

  const [events, setEvents] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return defaultEvents;
  });

  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState(" ");
  const [now, setNow] = useState(new Date());

  const [form, setForm] = useState({
    name: "",
    location: "",
    type: "Custom",
    opens: "",
    closes: "",
    notes: ""
  });

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  function parseDate(d) {
    return d ? new Date(d + "T00:00:00") : null;
  }

  function formatDateLocal(d) {
    if (!d) return "-";
    const dt = new Date(d);
    return dt.toLocaleDateString();
  }

  function getStatus(e) {
    const open = parseDate(e.opens);
    const close = parseDate(e.closes);
    if (!open || !close) return { key: "unknown", label: "No dates", color: "gray" };
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (today < open) return { key: "upcoming", label: "Upcoming", color: "yellow" };
    if (today >= open && today <= close) return { key: "open", label: "Open", color: "green" };
    return { key: "closed", label: "Closed", color: "red" };
  }

  function timeDiffHuman(target) {
    if (!target) return "-";
    const diffMs = target - now;
    const sign = diffMs >= 0 ? 1 : -1;
    const abs = Math.abs(diffMs);
    const days = Math.floor(abs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((abs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((abs / (1000 * 60)) % 60);
    const seconds = Math.floor((abs / 1000) % 60);
    const prefix = sign >= 0 ? "in " : ""
    const suffix = sign < 0 ? " ago" : "";
    if (days > 0) return `${prefix}${days}d ${hours}h${suffix}`;
    if (hours > 0) return `${prefix}${hours}h ${minutes}m${suffix}`;
    if (minutes > 0) return `${prefix}${minutes}m ${seconds}s${suffix}`;
    return `${prefix}${seconds}s${suffix}`;
  }

  function displayCountdown(e) {
    const open = parseDate(e.opens);
    const close = parseDate(e.closes);
    if (!open) return "No opens date";
    if (now < open) return `Opens ${timeDiffHuman(open)}`;
    if (now >= open && close) return `Closes ${timeDiffHuman(close)}`;
    return "Open (no close date)";
  }

  function addEvent(ev) {
    if (!ev.name || !ev.opens) return alert("Please provide at least a name and opens date.");
    const newEv = { ...ev, id: `${ev.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}` };
    setEvents((s) => [newEv, ...s]);
    setForm({ name: "", location: "", type: "Custom", opens: "", closes: "", notes: "" });
  }

  function removeEvent(id) {
    if (!confirm("Remove this event?")) return;
    setEvents((s) => s.filter((x) => x.id !== id));
  }

  const filtered = events.filter((e) => {
    if (filter === "Majors" && e.type !== "Major") return false;
    if (filter === "SuperHalfs" && e.type !== "SuperHalf") return false;
    if (filter === "Custom" && e.type !== "Custom") return false;
    if (query && !(`${e.name} ${e.location} ${e.notes} ${e.type}`.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  filtered.sort((a, b) => {
    const sa = getStatus(a);
    const sb = getStatus(b);
    const aNext = (sa.key === "upcoming") ? parseDate(a.opens) : parseDate(a.closes);
    const bNext = (sb.key === "upcoming") ? parseDate(b.opens) : parseDate(b.closes);
    if (!aNext && !bNext) return 0;
    if (!aNext) return 1;
    if (!bNext) return -1;
    return aNext - bNext;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">🏃 Running Event Planner</h1>
          <p className="text-sm text-slate-600 mt-1">Live countdowns to ballot opens & closes. Add your own races and get automatic color-coded statuses.</p>
        </header>

        <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex gap-2 items-center">
            <button className={`px-3 py-1 rounded ${filter === 'All' ? 'bg-slate-800 text-white' : 'bg-white'} shadow-sm`} onClick={() => setFilter('All')}>All</button>
            <button className={`px-3 py-1 rounded ${filter === 'Majors' ? 'bg-slate-800 text-white' : 'bg-white'} shadow-sm`} onClick={() => setFilter('Majors')}>Majors</button>
            <button className={`px-3 py-1 rounded ${filter === 'SuperHalfs' ? 'bg-slate-800 text-white' : 'bg-white'} shadow-sm`} onClick={() => setFilter('SuperHalfs')}>SuperHalfs</button>
            <button className={`px-3 py-1 rounded ${filter === 'Custom' ? 'bg-slate-800 text-white' : 'bg-white'} shadow-sm`} onClick={() => setFilter('Custom')}>Custom</button>
          </div>

          <div className="flex gap-2 items-center">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search races, location, notes..." className="px-3 py-2 rounded border shadow-sm" />
            <div className="text-sm text-slate-600">Now: <strong>{now.toLocaleString()}</strong></div>
          </div>
        </div>

        <main className="grid gap-4">
          {filtered.map((e) => {
            const st = getStatus(e);
            return (
              <div key={e.id} className="bg-white rounded-2xl p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${st.color === 'green' ? 'bg-emerald-500' : st.color === 'yellow' ? 'bg-amber-400' : st.color === 'red' ? 'bg-rose-500' : 'bg-slate-400'}`} />
                    <div>
                      <div className="text-lg font-semibold">{e.name}</div>
                      <div className="text-sm text-slate-500">{e.location} · {e.type}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-slate-700">
                    <div>Opens: <strong>{formatDateLocal(e.opens)}</strong></div>
                    <div>Closes: <strong>{formatDateLocal(e.closes)}</strong></div>
                    <div className="mt-2">{displayCountdown(e)}</div>
                    {e.notes ? <div className="mt-2 text-xs text-slate-500">{e.notes}</div> : null}
                  </div>
                </div>

                <div className="mt-3 md:mt-0 flex gap-2 items-center">
                  <div className="text-sm text-slate-600">Status: <strong className="ml-1">{st.label}</strong></div>
                  <button onClick={() => removeEvent(e.id)} className="px-3 py-1 bg-rose-50 text-rose-700 rounded shadow-sm text-sm">Remove</button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 ? (
            <div className="bg-white p-6 rounded shadow text-slate-600">No races match your filters.</div>
          ) : null}
        </main>

        <section className="mt-8 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">➕ Add a race (custom)</h2>
          <p className="text-sm text-slate-500">Add any race or ballot window you want to track. Dates are local and should be entered as YYYY-MM-DD.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <input className="px-3 py-2 border rounded" placeholder="Name (e.g. Bristol Marathon)" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
            <input className="px-3 py-2 border rounded" placeholder="Location (city, country)" value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} />
            <select className="px-3 py-2 border rounded" value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}>
              <option>Custom</option>
              <option>Major</option>
              <option>SuperHalf</option>
            </select>
            <input className="px-3 py-2 border rounded" type="date" value={form.opens} onChange={(e) => setForm((s) => ({ ...s, opens: e.target.value }))} />
            <input className="px-3 py-2 border rounded" type="date" value={form.closes} onChange={(e) => setForm((s) => ({ ...s, closes: e.target.value }))} />
            <input className="px-3 py-2 border rounded" placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))} />
          </div>

          <div className="mt-3 flex gap-2">
            <button onClick={() => addEvent(form)} className="px-4 py-2 rounded bg-slate-800 text-white shadow">Add race</button>
            <button onClick={() => setForm({ name: "", location: "", type: "Custom", opens: "", closes: "", notes: "" })} className="px-4 py-2 rounded bg-white border">Clear</button>
            <button onClick={() => {
              if (!confirm('Export events to clipboard as JSON?')) return;
              navigator.clipboard.writeText(JSON.stringify(events, null, 2));
              alert('Exported to clipboard');
            }} className="px-4 py-2 rounded bg-white border">Export JSON</button>
            <button onClick={() => {
              if (!confirm('Reset to default preloaded sample events? This will overwrite your stored events.')) return;
              localStorage.removeItem(STORAGE_KEY);
              setEvents(defaultEvents);
            }} className="px-4 py-2 rounded bg-amber-50 text-amber-700 border">Reset to sample</button>
          </div>
        </section>

        <footer className="mt-8 text-sm text-slate-500">Tip: Host this on GitHub Pages / Netlify or run locally. The app stores your custom races in your browser's local storage.</footer>
      </div>
    </div>
  );
}
