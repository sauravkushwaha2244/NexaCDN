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

        fetch("http://localhost:5000/analytics")
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



    return (
        <div className="dashboard">

            <h1>NexaCDN Dashboard</h1>

            <div>
                Total Requests: {stats.totalRequests}
            </div>

            <RequestTable requests={requests}/>

        </div>
    );

}


export default Dashboard;