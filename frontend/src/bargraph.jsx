/* eslint-disable react/prop-types */
import {BarChart,Bar,ResponsiveContainer, Tooltip, YAxis, XAxis} from "recharts";

export default function Bargraph({bardata}){
   
    return (
        <>
        <div className="h-72  w-full">
        <ResponsiveContainer width={"100%"} height={"100%"} >
        <BarChart width={48} height={48} data={bardata}>
            <Tooltip />
            <YAxis dataKey="count"></YAxis>
            <XAxis dataKey="range"></XAxis>
        <Bar dataKey="count" fill="#8874d8"/>
        </BarChart>
        </ResponsiveContainer>
        </div>
        </>
    )
}