import { Typography } from "@mui/material";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const UserComparisonChart = ({ userData1, userData2 }) => {
  const data = [
    { name: "Rozegrane mecze", user1: userData1.match, user2: userData2.match },
    {
      name: "Wygrane mecze",
      user1: userData1.winmatch,
      user2: userData2.winmatch,
    },
  ];

  const data2 = [
    { name: "Rozegrane sety", user1: userData1.sets, user2: userData2.sets },
    {
      name: "Wygrane sety",
      user1: userData1.winsets,
      user2: userData2.winsets,
    },
  ];

  const data3 = [
    {
      name: "% Wygranych meczy",
      user1: userData1.matchpercent * 100,
      user2: userData2.matchpercent * 100,
    },
    {
      name: "% Wygranych setów",
      user1: userData1.setspercent * 100,
      user2: userData2.setspercent * 100,
    },
  ];

  const data4 = [
    {
      name: "Wygrane mecze",
      user1: userData1.pairmatch,
      user2: userData2.pairmatch,
    },
  ];

 

  const data5 = [
    {
      name: "Wygrane sety",
      user1: userData1.pairsets,
      user2: userData2.pairsets,
    },
  ];

  const data6 = [
    {
      name: "% Wygranych meczy",
      user1: userData1.pairmatchp *100,
      user2: userData2.pairmatchp *100,
    },
  ];

  const data7 = [
    {
      name: "% Wygranych setów",
      user1: userData1.pairsetsp *100,
      user2: userData2.pairsetsp *100,
    },
  ];

  const Chart = ({ data, name1, name2 }) => {
    return (
      <BarChart width={400} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="user1" fill="#293241" name={`${name1}`} />
        <Bar dataKey="user2" fill="#4CAF50" name={`${name2}`} />
      </BarChart>
    );
  };

  const Chart2 = ({ data, name1, name2 }) => {
    return (
      <BarChart width={400} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="user1" fill="#5e0c2b" name={`${name1}`} />
        <Bar dataKey="user2" fill="#5c87b8" name={`${name2}`} />
      </BarChart>
    );
  };

  return (
    <>
      <div className="container"></div>
      <div className="container">
        <Typography variant="h4">
          {userData1.name} vs {userData2.name}
        </Typography>
      </div>
      <div className="container">
        <Typography variant="h5">
          Rozegranych pojedynków: {userData1.pairmatchplayed ? userData1.pairmatchplayed : 0}{" "}
        </Typography>
      </div>
      <div className="container">
        <Typography variant="h5">
          Rozegranych setów: {userData1.pairsetsplayed ? userData1.pairsetsplayed : 0 }{" "}
        </Typography>
      </div>

      <div className="container">
        {" "}
        <Chart2
          data={data4}
          name1={userData1.name}
          name2={userData2.name}
        />{" "}
        <Chart2 data={data5} name1={userData1.name} name2={userData2.name} />
      </div>


      <div className="container">
        {" "}
        <Chart2
          data={data6}
          name1={userData1.name}
          name2={userData2.name}
        />{" "}
        <Chart2 data={data7} name1={userData1.name} name2={userData2.name} />
      </div>

      <div className="container">
        <Typography variant="h5">Dane ogólne:</Typography>
      </div>
      <div className="container">
        <Chart data={data3} name1={userData1.name} name2={userData2.name} />
        <Chart data={data} name1={userData1.name} name2={userData2.name} />
      </div>
      <div className="container">
        <Chart data={data2} name1={userData1.name} name2={userData2.name} />
      </div>
    </>
  );
};

export default UserComparisonChart;
