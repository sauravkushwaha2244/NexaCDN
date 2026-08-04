function Sidebar({ activeTab, setActiveTab }) {

    const items = [
        { id: "dashboard", icon: "📊", label: "Dashboard"  },
        { id: "analytics", icon: "📈", label: "Analytics"  },
        { id: "servers",   icon: "🖥️",  label: "Servers"    },
        { id: "cache",     icon: "💾",  label: "Cache"      },
    ];

    return (
        <aside className="sidebar">
            <h1 className="logo">NexaCDN</h1>
            <ul>
                {items.map(item => (
                    <li
                        key={item.id}
                        className={activeTab === item.id ? "active" : ""}
                        onClick={() => setActiveTab(item.id)}
                    >
                        {item.icon} {item.label}
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;