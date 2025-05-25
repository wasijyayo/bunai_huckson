import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import useFirebase from "../hooks/useFirebase.jsx"; // ✅ Firebase のデータを取得するフック

const ApexChart = () => {
  const { learnings } = useFirebase(); // ✅ `useFirebase` から `learnings` を取得
  const [state, setState] = useState({
    series: [
      { name: "消費カロリー", data: learnings.map((item) => item.test || 0) },
    ], // ✅ `test` の値をグラフに適用
    options: {
      chart: { height: 350, type: "line", zoom: { enabled: false } },
      dataLabels: { enabled: false },
      stroke: { curve: "straight" },
      title: { text: "デフォルトタイトル", align: "left" }, // ✅ 初期値
      grid: { row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 } },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      }, // ✅ 初期値
    },
  });

  useEffect(() => {
    if (learnings.length > 0) {
      console.log(learnings);
      setState((prevState) => ({
        ...prevState,
        series: [
          {
            name: "消費カロリー",
            data: learnings.map((item) => item.time || 0),
          },
        ],
        options: {
          ...prevState.options,
          title: {
            text: learnings[0].title || "デフォルトタイトル",
            align: "left",
          }, // ✅ `title` を反映
          xaxis: {
            categories: learnings.map((item) =>
              item.createAt
                ? new Date(item.createAt.seconds * 1000).toLocaleDateString(
                    "ja-JP"
                  )
                : item.date
                ? new Date(item.date.seconds * 1000).toLocaleDateString("ja-JP")
                : "未設定"
            ),
          }, // ✅ `createAt` と `date` を X軸に適用
        },
      }));
    }
  }, [learnings]); // ✅ `learnings` が変更されたら適用

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
};
export default Glaf;
