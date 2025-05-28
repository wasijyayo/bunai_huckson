import React, { useState } from "react";
import ReactApexChart from "react-apexcharts"; // ✅ ApexCharts をインポート

const ApexChart = () => {
    const [state, setState] = useState({
        series: [{
            name: "Desktops",
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }],
        options: {
            chart: { height: 350, type: 'line', zoom: { enabled: false } },
            dataLabels: { enabled: false },
            stroke: { curve: 'straight' },
            title: { text: 'Product Trends by Month', align: 'left' },
            grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 }},
            xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] }
        }
    });

    return (
        <div>
            <div id="chart">
                <ReactApexChart options={state.options} series={state.series} type="line" height={350} />
            </div>
        </div>
    );
};

const Glaf = () => {
    return (
        <div>
            <h1>Glaf Component</h1>
            <p>これはグラフ表示ページです。</p>
            <ApexChart /> {/* ✅ `ApexChart` を追加 */}
        </div>
    );
};

export default Glaf;
