import { useEffect, useState } from "react";
import socket from "../socket.js";
import StatCard    from "./StatCard";
import ServerCard  from "./ServerCard";
import CacheChart  from "./CacheChart";
import TrafficChart from "./TrafficChart";
import RequestTable from "./RequestTable";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Dashboard({ activeTab }) {

    const [stats, setStats] = useState({
        totalRequests: 0, cacheHits: 0, cacheMiss: 0,
        originRequests: 0, averageResponseTime: 0, trafficHistory: []
    });
    const [servers,    setServers]    = useState([]);
    const [requests,   setRequests]   = useState([]);
    const [demoLog,    setDemoLog]    = useState([]);
    const [running,    setRunning]    = useState(false);
    const [demoMsg,    setDemoMsg]    = useState("");
    const [lastResult, setLastResult] = useState(null);

    // ── Fetch analytics + servers ────────────────────────────
    const fetchStats = () =>
        fetch(`${BACKEND}/analytics`).then(r => r.json()).then(setStats).catch(() => {});

    const fetchServers = () =>
        fetch(`${BACKEND}/servers`).then(r => r.json()).then(setServers).catch(() => {});

    useEffect(() => {
        fetchStats();
        fetchServers();

        // refresh server health every 15s
        const hInterval = setInterval(fetchServers, 15000);

        socket.on("analyticsUpdate", setStats);
        socket.on("requestUpdate", data =>
            setRequests(prev => [data, ...prev].slice(0, 20))
        );
        return () => {
            clearInterval(hInterval);
            socket.off("analyticsUpdate");
            socket.off("requestUpdate");
        };
    }, []);

    const hitRate = stats.totalRequests > 0
        ? ((stats.cacheHits / stats.totalRequests) * 100).toFixed(1) : "0.0";

    // ── Demo helpers ─────────────────────────────────────────
    const sleep  = ms => new Promise(r => setTimeout(r, ms));
    const addLog = (msg, type) =>
        setDemoLog(prev => [{ msg, type, id: Date.now() + Math.random() }, ...prev].slice(0, 20));

    const clearCache = async () => {
        setDemoMsg("🗑️ Clearing cache…");
        await fetch(`${BACKEND}/cache/clear`, { method: "POST" });
        addLog("Cache cleared — Redis flushed ✅", "info");
        setDemoMsg("✅ Cache cleared! Ready to demo.");
    };

    const hitProxy = async (label) => {
        const t0  = Date.now();
        const res = await fetch(`${BACKEND}/proxy/data`);
        const d   = await res.json();
        const ms  = Date.now() - t0;
        const isHit = d.source === "cache";
        setLastResult(isHit ? "HIT" : "MISS");
        addLog(
            `${label}: ${isHit ? "✅ CACHE HIT" : "❌ CACHE MISS — fetched from origin"} (${ms}ms)`,
            isHit ? "hit" : "miss"
        );
    };

    const runDemo = async () => {
        setRunning(true); setDemoLog([]); setLastResult(null);
        setDemoMsg("Step 1 — Clearing cache…");
        await clearCache(); await sleep(800);
        setDemoMsg("Step 2 — First request → expect MISS…");
        addLog("━━━━━  SCENARIO 1: Cache MISS  ━━━━━", "divider");
        await hitProxy("Request #1"); await sleep(1000);
        setDemoMsg("Step 3 — Repeat requests → expect HITs…");
        addLog("━━━━━  SCENARIO 2: Cache HITs  ━━━━━", "divider");
        for (let i = 2; i <= 5; i++) { await hitProxy(`Request #${i}`); await sleep(400); }
        setDemoMsg("🎉 Demo complete! Check the table below."); setRunning(false);
    };

    // ── Tab content ──────────────────────────────────────────
    const renderDashboard = () => (
        <>
            {/* Demo Panel */}
            <div className="demo-panel">
                <div className="demo-header">
                    <span>🚀 Hackathon Demo Mode</span>
                    <div className="demo-buttons">
                        <button className="btn-clear" onClick={clearCache} disabled={running}>🗑️ Clear Cache</button>
                        <button className="btn-demo"  onClick={runDemo}    disabled={running}>
                            {running ? "⏳ Running…" : "▶ Run Demo (HIT + MISS)"}
                        </button>
                    </div>
                </div>
                {demoMsg && <div className="demo-status">{demoMsg}</div>}
                {lastResult && (
                    <div className={`demo-badge ${lastResult === "HIT" ? "badge-hit" : "badge-miss"}`}>
                        {lastResult === "HIT"
                            ? "✅ CACHE HIT — served from Redis ⚡"
                            : "❌ CACHE MISS — fetched from Origin Server"}
                    </div>
                )}
                {demoLog.length > 0 && (
                    <div className="demo-log">
                        {demoLog.map(l => (
                            <div key={l.id} className={`log-line log-${l.type}`}>{l.msg}</div>
                        ))}
                    </div>
                )}
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
                <StatCard title="Total Requests"    value={stats.totalRequests} />
                <StatCard title="Cache Hits ✅"      value={stats.cacheHits} />
                <StatCard title="Cache Misses ❌"    value={stats.cacheMiss} />
                <StatCard title="Origin Requests"   value={stats.originRequests} />
                <StatCard title="Avg Response Time" value={`${stats.averageResponseTime} ms`} />
                <StatCard title="Hit Rate"          value={`${hitRate}%`} />
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <CacheChart hits={stats.cacheHits} miss={stats.cacheMiss} />
                <TrafficChart history={stats.trafficHistory} />
            </div>

            {/* Live Table */}
            <RequestTable requests={requests} />
        </>
    );

    const renderAnalytics = () => (
        <>
            <h2 className="section-title">📈 Analytics Overview</h2>
            <div className="stats-grid">
                <StatCard title="Total Requests"    value={stats.totalRequests} />
                <StatCard title="Cache Hits"        value={stats.cacheHits} />
                <StatCard title="Cache Misses"      value={stats.cacheMiss} />
                <StatCard title="Origin Requests"   value={stats.originRequests} />
                <StatCard title="Avg Response Time" value={`${stats.averageResponseTime} ms`} />
                <StatCard title="Cache Hit Rate"    value={`${hitRate}%`} />
            </div>
            <div className="charts-grid" style={{ marginTop: 32 }}>
                <TrafficChart history={stats.trafficHistory} />
                <CacheChart  hits={stats.cacheHits} miss={stats.cacheMiss} />
            </div>
        </>
    );

    const renderServers = () => (
        <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <h2 className="section-title">🖥️ Origin Servers</h2>
                <button className="btn-clear" onClick={fetchServers}>🔄 Refresh</button>
            </div>
            {servers.length === 0 ? (
                <p style={{ color:"#888" }}>Loading server status…</p>
            ) : (
                <div className="server-grid">
                    {servers.map((s, i) => (
                        <div key={i} className="server-card">
                            <h3>Origin Server {i + 1}</h3>
                            <p style={{ color:"#888", fontSize:12, marginBottom:8, wordBreak:"break-all" }}>{s.url}</p>
                            <p>Status: <span className={s.healthy ? "online" : "offline"}>
                                {s.healthy ? "🟢 Healthy" : "🔴 Down"}
                            </span></p>
                            {s.healthy && (
                                <p style={{ color:"#2563eb", marginTop:6 }}>
                                    Response: <strong>{s.responseTime}ms</strong>
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <div className="chart-card" style={{ marginTop:32 }}>
                <h3>Load Balancer — Request Distribution</h3>
                <CacheChart hits={stats.cacheHits} miss={stats.cacheMiss} />
            </div>
        </>
    );

    const renderCache = () => {
        const ttl = stats.totalRequests > 0 ? "300s (5 min)" : "—";
        return (
            <>
                <h2 className="section-title">💾 Cache Status</h2>
                <div className="stats-grid">
                    <StatCard title="Cache Hits"     value={stats.cacheHits} />
                    <StatCard title="Cache Misses"   value={stats.cacheMiss} />
                    <StatCard title="Hit Rate"       value={`${hitRate}%`} />
                    <StatCard title="Cache TTL"      value={ttl} />
                </div>
                <div className="charts-grid" style={{ marginTop:32 }}>
                    <CacheChart hits={stats.cacheHits} miss={stats.cacheMiss} />
                    <div className="chart-card">
                        <h3>Cache Performance</h3>
                        <div className="cache-info">
                            <div className="cache-row">
                                <span>🔵 Redis (Primary)</span>
                                <span className="online">● Active</span>
                            </div>
                            <div className="cache-row">
                                <span>🟡 Memory Cache (Fallback)</span>
                                <span className="online">● Active</span>
                            </div>
                            <div className="cache-row">
                                <span>⏱ Default TTL</span>
                                <span>300 seconds</span>
                            </div>
                            <div className="cache-row">
                                <span>📦 Cached Keys</span>
                                <span>{stats.originRequests} unique routes</span>
                            </div>
                            <div className="cache-row">
                                <span>⚡ Avg Hit Speed</span>
                                <span style={{color:"#16a34a"}}>~2–5 ms</span>
                            </div>
                            <div className="cache-row">
                                <span>🌐 Avg Miss Speed</span>
                                <span style={{color:"#ef4444"}}>~800–1500 ms</span>
                            </div>
                        </div>
                        <button className="btn-clear" style={{ marginTop:20, width:"100%" }}
                            onClick={clearCache} disabled={running}>
                            🗑️ Flush Cache Now
                        </button>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="dashboard">
            <h1>NexaCDN Dashboard</h1>
            {activeTab === "dashboard"  && renderDashboard()}
            {activeTab === "analytics"  && renderAnalytics()}
            {activeTab === "servers"    && renderServers()}
            {activeTab === "cache"      && renderCache()}
        </div>
    );
}

export default Dashboard;


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