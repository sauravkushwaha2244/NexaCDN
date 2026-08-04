import { useEffect, useState } from "react";

import socket from "../socket.js";

import StatCard from "./StatCard";
import ServerCard from "./ServerCard";
import TrafficChart from "./TrafficChart";
import CacheChart from "./CacheChart";
import RequestTable from "./RequestTable";


function Dashboard() {

    const [stats, setStats] = useState({
        totalRequests: 0,
        cacheHits: 0,
        cacheMiss: 0,
        originRequests: 0,
        averageResponseTime: 0
    });

    const [requests, setRequests] = useState([]);


    useEffect(() => {

        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

        fetch(`${backendUrl}/analytics`)
            .then((res) => res.json())
            .then((data) => {
                setStats(data);
            })
            .catch((err) => {
                console.log("Analytics error:", err);
            });


        socket.on("analyticsUpdate", (data) => {
            setStats(data);
        });


        socket.on("requestUpdate", (data) => {
            setRequests((prev) => [data, ...prev].slice(0, 10));
        });


        socket.on("connect_error", (err) => {
            console.log("Socket error:", err.message);
        });


        return () => {
            socket.off("analyticsUpdate");
            socket.off("requestUpdate");
            socket.off("connect_error");
        };


    }, []);



    const hitRate = stats.totalRequests > 0
        ? ((stats.cacheHits / stats.totalRequests) * 100).toFixed(1)
        : 0;

    return (
        <div className="dashboard">

            <h1>NexaCDN Dashboard</h1>

            {/* Stat Cards */}
            <div className="stats-grid">
                <StatCard title="Total Requests"     value={stats.totalRequests} />
                <StatCard title="Cache Hits ✅"       value={stats.cacheHits} />
                <StatCard title="Cache Misses ❌"     value={stats.cacheMiss} />
                <StatCard title="Origin Requests"    value={stats.originRequests} />
                <StatCard title="Avg Response Time"  value={`${stats.averageResponseTime} ms`} />
                <StatCard title="Hit Rate"           value={`${hitRate}%`} />
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <CacheChart hits={stats.cacheHits} miss={stats.cacheMiss} />
                <TrafficChart totalRequests={stats.totalRequests} />
            </div>

            {/* Live Request Table */}
            <RequestTable requests={requests} />

        </div>
    );

}


export default Dashboard;