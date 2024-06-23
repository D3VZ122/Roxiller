/* eslint-disable react/prop-types */
import React from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF19FF", "#19D3FF", "#FF193D"];

export default function Piechart({ data }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="Count"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
