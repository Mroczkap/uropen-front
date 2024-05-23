import "react-toastify/dist/ReactToastify.css";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "../api/axios";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import React from "react";

const Rankings = ({ idrankingu }) => {
  const [rankings, setRankings] = useState([]);

  function getRankings() {
    axios
      .get(`/rankings?idrankingu=${idrankingu}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.data;
      })
      .then((data) => {
        const data2 = data.map((row, index) => ({
          ...row,
          itemNumber: index + 1,
        }));
        setRankings(data2);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  useEffect(() => {
    getRankings();
  }, [idrankingu]);

  return (
    <>
      <Box
        sx={{ height: "100", width: "100%" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        marginTop={2}
      >
        <DataGrid
          rows={rankings}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 30,
              },
            },
          }}
          sx={{ minWidth: 350, width: "90%", maxWidth: 1200 }}
          pageSizeOptions={[30]}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </>
  );
};

function renderPercentageCell(params) {
  const percentage = params.value * 100;

  return <span>{percentage.toFixed(1)}%</span>; // Display with two decimal places
}

const columns = [
  {
    field: "itemNumber",
    sortDirection: "asc",
    sortable: false,
    headerName: "LP",
    width: 50,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "name",
    renderHeader: () => (
      <strong style={{ whiteSpace: "normal", overflow: "hidden" }}>
        {"Zawodnik"}
      </strong>
    ),
    width: 200,

    editable: false,
  },
  {
    field: "matchpercent",
    renderHeader: () => {
      const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed

      return (
        <strong style={{ whiteSpace: "normal", overflow: "hidden" }}>
          {isMobile ? "%WM" : "% Wygranych meczy"}
        </strong>
      );
    },
    type: "number",
    width: 155,
    editable: false,
    renderCell: renderPercentageCell,
    description: "Procent wygranych meczy",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "match",
    renderHeader: () => {
      const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed

      return isMobile ? "RM" : "Rozegrane mecze";
    },
    type: "number",
    width: 135,
    description: "Rozegrane mecze",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "winmatch",
    renderHeader: () => {
      const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed

      return (
        <strong style={{ whiteSpace: "normal", overflow: "hidden" }}>
          {isMobile ? "WM" : "Wygrane mecze"}
        </strong>
      );
    },

    type: "number",
    width: 125,
    description: "Wygrane mecze",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "setspercent",
    renderHeader: () => {
      const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed

      return isMobile ? "%WS" : "% Wygranych setów";
    },
    type: "number",
    width: 155,
    editable: false,
    description: "Procent wygranych setów",
    renderCell: renderPercentageCell,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "sets",
    renderHeader: () => {
      const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed

      return isMobile ? "RS" : "Rozegrane sety";
    },
    type: "number",
    editable: false,
    width: 120,
    description: "Rozegrane sety",
    align: "center",
    headerAlign: "center",
  },

  {
    field: "winsets",
    renderHeader: () => {
      const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed

      return isMobile ? "WS" : "Wygrane sety";
    },
    type: "number",
    width: 100,
    editable: false,
    description: "Wygrane sety",
    align: "center",
    headerAlign: "center",
  },

  {
    field: "tournaments",
    renderHeader: () => {
      const isMobile = window.innerWidth <= 1000; // Adjust the breakpoint as needed

      return isMobile ? "RT" : "Rozegrane turnieje";
    },
    description: "123132",
    type: "number",
    width: 140,
    align: "center",
    headerAlign: "center",
  },
];

export default Rankings;
