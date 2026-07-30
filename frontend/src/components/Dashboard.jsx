import {useEffect,useState} from "react";

import socket from "../socket";

import StatCard from "./StatCard";


function Dashboard(){


const [stats,setStats]=useState({

totalRequests:0,

cacheHits:0,

cacheMiss:0,

originRequests:0,

averageResponseTime:0

});



useEffect(()=>{


socket.on(
"analyticsUpdate",
(data)=>{

    setStats(data);

});


return()=>{

socket.off(
"analyticsUpdate"
);

};


},[]);



return(

<div>


<h1>
NexaCDN Live Dashboard
</h1>


<div className="container">


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
title="Response Time"
value={stats.averageResponseTime+" ms"}
/>


</div>


</div>

);


}


export default Dashboard;