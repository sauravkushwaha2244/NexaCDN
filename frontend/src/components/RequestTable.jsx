function RequestTable({ requests }) {

    return (

        <div className="request-card">

            <h2>
                Live Request Monitor
            </h2>


            <table>

                <thead>

                    <tr>

                        <th>
                            Time
                        </th>

                        <th>
                            URL
                        </th>

                        <th>
                            Source
                        </th>

                        <th>
                            Server
                        </th>

                        <th>
                            Response Time
                        </th>

                    </tr>

                </thead>


                <tbody>


                    {
                        requests.length === 0 ? (

                            <tr>

                                <td colSpan="5">
                                    No Requests Yet
                                </td>

                            </tr>

                        ) :


                        requests.map((req,index)=>(

                            <tr key={index}>

                                <td>
                                    {req.time}
                                </td>


                                <td>
                                    {req.url}
                                </td>


                                <td 
                                className={
                                    req.source==="cache"
                                    ?
                                    "hit"
                                    :
                                    "miss"
                                }
                                >

                                    {req.source}

                                </td>


                                <td>
                                    {req.server || "-"}
                                </td>


                                <td>
                                    {req.responseTime} ms
                                </td>


                            </tr>

                        ))

                    }


                </tbody>


            </table>


        </div>

    );

}


export default RequestTable;