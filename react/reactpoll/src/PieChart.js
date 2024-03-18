// PieChart.js

import React from "react";
import { Chart } from "react-google-charts";
// import "./piechart.css";

function PieChart({ chartData, chartOptions }) {
  return (
    <Chart className="pie-chart"
      chartType="PieChart"
      data={chartData}
      options={chartOptions}
      width={"100%"}
      height={"400px"}
    />
  );
}

export default PieChart;
