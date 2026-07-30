import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function CacheChart({

    hits,

    miss

}) {

    const data = {

        labels: [

            "Cache Hits",

            "Cache Miss"

        ],

        datasets: [

            {

                data: [

                    hits,

                    miss

                ],

                backgroundColor: [

                    "#16a34a",

                    "#ef4444"

                ]

            }

        ]

    };

    return (

        <div className="chart-card">

            <h3>Cache Ratio</h3>

            <Doughnut data={data} />

        </div>

    );

}

export default CacheChart;