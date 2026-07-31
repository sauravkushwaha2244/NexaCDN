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

        })

        .catch((err)=>{

            console.log(
                "Analytics error:",
                err
            );

        });




        // Live analytics update

        socket.on(
            "analyticsUpdate",
            (data)=>{

                setStats(data);

            }

        );




        // Live request monitor

        socket.on(
            "requestUpdate",
            (data)=>{


                setRequests(
                    (prev)=>[

                        data,

                        ...prev

                    ].slice(0,10)

                );


            }

        );





        return ()=>{


            socket.off(
                "analyticsUpdate"
            );


            socket.off(
                "requestUpdate"
            );


        };


    },[]);




    return (


        <div className="dashboard">


            <h1>
                NexaCDN Dashboard
            </h1>




            <div className="stats-grid">


                <StatCard

                    title="Total Requests"

                    value={stats.totalRequests}

                />



                <StatCard

                    title="Cache Hits"

                    value={stats.cacheHits}

                />



                <StatCard

                    title="Cache Miss"

                    value={stats.cacheMiss}

                />



                <StatCard

                    title="Origin Requests"

                    value={stats.originRequests}

                />



                <StatCard

                    title="Avg Response Time"

                    value={`${stats.averageResponseTime} ms`}

                />


            </div>





            <div className="charts-grid">


                <TrafficChart

                    totalRequests={
                        stats.totalRequests
                    }

                />



                <CacheChart

                    hits={
                        stats.cacheHits
                    }

                    miss={
                        stats.cacheMiss
                    }

                />


            </div>






            <RequestTable

                requests={requests}

            />







            <h2>
                Origin Servers
            </h2>



            <div className="server-grid">


                <ServerCard

                    name="Origin Server 1"

                    status={true}

                />



                <ServerCard

                    name="Origin Server 2"

                    status={true}

                />


            </div>



        </div>


    );

}


export default Dashboard;