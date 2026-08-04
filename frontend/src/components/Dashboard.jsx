import { useEffect, useState } from "react";
import socket from "../socket.js";
import StatCard from "./StatCard";
import CacheChart from "./CacheChart";
import TrafficChart from "./TrafficChart";
import RequestTable from "./RequestTable";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Dashboard() {

    const [stats, setStats] = useState({
        totalRequests: 0,
        cacheHits: 0,
        cacheMiss: 0,
        originRequests: 0,
        averageResponseTime: 0
    });

    const [requests, setRequests]   = useState([]);
    const [demoLog, setDemoLog]     = useState([]);
    const [running, setRunning]     = useState(false);
    const [demoMsg, setDemoMsg]     = useState("");
    const [lastResult, setLastResult] = useState(null); // "HIT" | "MISS"

    useEffect(() => {
        fetch(`${BACKEND}/analytics`)
            .then(r => r.json())
            .then(setStats)
            .catch(() => {});

        socket.on("analyticsUpdate", setStats);
        socket.on("requestUpdate", data =>
            setRequests(prev => [data, ...prev].slice(0, 10))
        );
        return () => {
            socket.off("analyticsUpdate");
            socket.off("requestUpdate");
        };
    }, []);

    const hitRate = stats.totalRequests > 0
        ? ((stats.cacheHits / stats.totalRequests) * 100).toFixed(1)
        : 0;

    // ── helpers ──────────────────────────────────────────────
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const addLog = (msg, type) =>
        setDemoLog(prev => [{ msg, type, id: Date.now() + Math.random() }, ...prev].slice(0, 20));

    const clearCache = async () => {
        setDemoMsg("🗑️  Clearing cache…");
        const res = await fetch(`${BACKEND}/cache/clear`, { method: "POST" });
        const data = await res.json();
        addLog("Cache cleared — Redis flushed ✅", "info");
        setDemoMsg("✅ Cache cleared! Ready to demo.");
        return data.success;
    };

    const hitProxy = async (label) => {
        const t0 = Date.now();
        const res = await fetch(`${BACKEND}/proxy/data`);
        const data = await res.json();
        const ms = Date.now() - t0;
        const source = data.source; // "cache" | "origin"
        const isHit = source === "cache";
        setLastResult(isHit ? "HIT" : "MISS");
        addLog(
            `${label}: ${isHit ? "✅ CACHE HIT" : "❌ CACHE MISS — fetched from origin"} (${ms}ms)`,
            isHit ? "hit" : "miss"
        );
        return { source, ms };
    };

    // ── main demo ─────────────────────────────────────────────
    const runDemo = async () => {
        setRunning(true);
        setDemoLog([]);
        setLastResult(null);

        // Step 1 — clear cache
        setDemoMsg("Step 1 — Clearing cache to reset state…");
        await clearCache();
        await sleep(800);

        // Step 2 — first request → MISS
        setDemoMsg("Step 2 — Sending FIRST request (expect a MISS)…");
        addLog("━━━━━━━━  SCENARIO 1: Cache MISS  ━━━━━━━━", "divider");
        const r1 = await hitProxy("Request #1");
        await sleep(1000);

        // Step 3 — next 4 requests → HITs
        setDemoMsg("Step 3 — Sending follow-up requests (expect HITs)…");
        addLog("━━━━━━━━  SCENARIO 2: Cache HITs  ━━━━━━━━", "divider");
        for (let i = 2; i <= 5; i++) {
            await hitProxy(`Request #${i}`);
            await sleep(400);
        }

        setDemoMsg("🎉 Demo complete! Scroll down to see HIT vs MISS in the table.");
        setRunning(false);
    };

    return (
        <div className="dashboard">
            <h1>NexaCDN Dashboard</h1>

            {/* ── HACKATHON DEMO PANEL ── */}
            <div className="demo-panel">
                <div className="demo-header">
                    <span>🚀 Hackathon Demo Mode</span>
                    <div className="demo-buttons">
                        <button className="btn-clear" onClick={clearCache} disabled={running}>
                            🗑️ Clear Cache
                        </button>
                        <button className="btn-demo" onClick={runDemo} disabled={running}>
                            {running ? "⏳ Running…" : "▶ Run Demo (HIT + MISS)"}
                        </button>
                    </div>
                </div>

                {demoMsg && (
                    <div className="demo-status">{demoMsg}</div>
                )}

                {lastResult && (
                    <div className={`demo-badge ${lastResult === "HIT" ? "badge-hit" : "badge-miss"}`}>
                        {lastResult === "HIT" ? "✅ CACHE HIT — served from Redis ⚡" : "❌ CACHE MISS — fetched from Origin Server"}
                    </div>
                )}

                {demoLog.length > 0 && (
                    <div className="demo-log">
                        {demoLog.map(l => (
                            <div key={l.id} className={`log-line log-${l.type}`}>
                                {l.msg}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── STAT CARDS ── */}
            <div className="stats-grid">
                <StatCard title="Total Requests"    value={stats.totalRequests} />
                <StatCard title="Cache Hits ✅"      value={stats.cacheHits} />
                <StatCard title="Cache Misses ❌"    value={stats.cacheMiss} />
                <StatCard title="Origin Requests"   value={stats.originRequests} />
                <StatCard title="Avg Response Time" value={`${stats.averageResponseTime} ms`} />
                <StatCard title="Hit Rate"          value={`${hitRate}%`} />
            </div>

            {/* ── CHARTS ── */}
            <div className="charts-grid">
                <CacheChart hits={stats.cacheHits} miss={stats.cacheMiss} />
                <TrafficChart totalRequests={stats.totalRequests} />
            </div>

            {/* ── REQUEST TABLE ── */}
            <RequestTable requests={requests} />
        </div>
    );
}

export default Dashboard;