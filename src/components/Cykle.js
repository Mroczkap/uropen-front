import "react-toastify/dist/ReactToastify.css";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "../api/axios";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import React from "react";

const Cykle = ({ idrankingu, count }) => {
  const [rankings, setRankings] = useState([]);

  function getRankings() {
    axios
      .get(`/cykle?idrankingu=${idrankingu}`, {
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

  const columns = generateColumns(count)

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


const generateColumns = (numberOfCompetitions) => {
  // Base columns
  const baseColumns = [
    {
      field: "itemNumber",
      sortDirection: "asc",
      sortable: false,
      headerName: "Miejsce",
      width: 90,
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
      field: "sumapkt",
      renderHeader: () => {
        const isMobile = window.innerWidth <= 768;
        return (
          <strong style={{ whiteSpace: "normal", overflow: "hidden" }}>
            {isMobile ? "PKT" : "Suma Punktów"}
          </strong>
        );
      },
      type: "number",
      width: 155,
      editable: false,
      description: "Suma punktów w całym cyklu ",
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <span style={{ fontWeight: "bold", color: "red" }}>{params.value}</span>
      ),
    },
   
  ];


  const competitionColumns = Array.from({ length: numberOfCompetitions }, (_, index) => ({
    field: `z${index + 1}`,
    headerName: `Zawody ${index + 1}`,
    width: 120,
    type: "number",
    align: "center",
    headerAlign: "center",
  }));
  // Combine base columns with competition columns
  return [...baseColumns, ...competitionColumns];
};



export default Cykle;
