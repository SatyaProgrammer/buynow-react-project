import React from "react";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export function LineChart({ chartData }) {
  return (
    <Line
      data={chartData}
      width={"30%"}
      options={{ maintainAspectRatio: false }}
    />
  );
}

export function PieChart({ chartData }) {
  return <Pie data={chartData} />;
}
