import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function TrafficChart({ totalRequests }) {

    const data = {

        labels: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6"
        ],

        datasets: [

            {

                label: "Requests",

                data: [

                    totalRequests,
                    totalRequests + 2,
                    totalRequests + 1,
                    totalRequests + 4,
                    totalRequests + 3,
                    totalRequests

                ],

                borderColor: "#2563eb",

                backgroundColor: "#93c5fd",

                tension: 0.4

            }

        ]

    };

    const options = {

        responsive: true,

        plugins: {

            legend: {

                position: "top"

            }

        }

    };

    return (

        <div className="chart-card">

            <h3>Traffic Analytics</h3>

            <Line
                data={data}
                options={options}
            />

        </div>

    );

}

export default TrafficChart;