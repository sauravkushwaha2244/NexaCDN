function Navbar() {
    return (
        <nav className="navbar">

            <div className="navbar-left">
                <h2>NexaCDN Dashboard</h2>
            </div>

            <div className="navbar-right">

                <div className="status">
                    🟢 System Online
                </div>

                <div className="profile">
                    Admin
                </div>

            </div>

        </nav>
    );
}

export default Navbar;