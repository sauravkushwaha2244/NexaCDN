import { useState } from "react";
import "./App.css";

import Navbar    from "./components/Navbar";
import Sidebar   from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

function App() {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="app">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="main">
                <Navbar />
                <Dashboard activeTab={activeTab} />
            </div>
        </div>
    );
}

export default App;