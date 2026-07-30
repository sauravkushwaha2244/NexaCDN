function ServerCard({ name, status }) {

    return (

        <div className="server-card">

            <div>

                <h3>{name}</h3>

                <p>
                    Status:
                    <span className={status ? "online" : "offline"}>
                        {status ? " 🟢 Healthy" : " 🔴 Down"}
                    </span>
                </p>

            </div>

        </div>

    );

}

export default ServerCard;