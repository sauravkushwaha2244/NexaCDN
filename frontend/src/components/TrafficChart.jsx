import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function TrafficChart({ history = [] }) {

    const labels  = history.map(h => h.time);
    const hits    = history.map(h => h.hits);
    const misses  = history.map(h => h.misses);

    const data = {
        labels,
        datasets: [
            {
                label: "Cache Hits",
                data: hits,
                borderColor: "#16a34a",
                backgroundColor: "rgba(22,163,74,0.15)",
                tension: 0.4,
                fill: true
            },
            {
                label: "Cache Misses",
                data: misses,
                borderColor: "#ef4444",
                backgroundColor: "rgba(239,68,68,0.10)",
                tension: 0.4,
                fill: true
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title:  { display: false }
        },
        scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } }
        }
    };

    if (history.length === 0) {
        return (
            <div className="chart-card">
                <h3>Traffic Analytics</h3>
                <p style={{ color: "#888", textAlign: "center", marginTop: "40px" }}>
                    Hit /proxy/data a few times to see live traffic...
                </p>
            </div>
        );
    }

    return (
        <div className="chart-card">
            <h3>Traffic Analytics — Hits vs Misses</h3>
            <Line data={data} options={options} />
        </div>
    );
}

export default TrafficChart;