import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

const EventGenre = ({ events }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = () => {
      const genres = ["React", "JavaScript", "Node", "jQuery", "AngularJS"];
      const data = genres.map((genre) => {
        const value = events.filter(({ summary }) =>
          summary.split(" ").includes(genre)
        ).length;

        return { name: genre, value };
      });
      return data.filter((genre) => genre.value !== 0);

    };
    setData(() => getData());
  }, [events]);

  const colors = ["#14404b", "orange", "#c4df2d", "#2f00cf", "#ff00d9"];
  const genreLabels = ({ x, y, cx, cy, name, percent, index }) => {
    return (
      <text
        style={{ fontSize: "13px" }}
        x={x}
        y={y}
        fill={colors[index]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <><PieChart
      width={400} height={400}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 0,
      }}
    >
      <Pie
        data={data}
        cx={200}
        cy={200}
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label={genreLabels}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index]} />
        ))}
      </Pie>
    </PieChart></>


  );
};

export default EventGenre;