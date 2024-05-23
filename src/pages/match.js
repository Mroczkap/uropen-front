import React, { useState, useEffect } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "../api/axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MatchModal from "../components/modal/MatchModal";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const Match = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [meczes, setMeczes] = useState([]);

  const [selectedPlayerName, seTSelectedPlayerName] = useState("");
  const handleFilterChange = (e) => {
    seTSelectedPlayerName(e.target.value);
  };

  const Item = styled(Paper)({
    textAlign: "center",
    minWidth: 350,
    width: "100%",
    maxWidth: 400,
  });

  const filteredData = meczes.filter((item) => {
    const player1Match = item.player1name
      .toLowerCase()
      .includes(selectedPlayerName.toLowerCase());
    const player2Match = item.player2name
      .toLowerCase()
      .includes(selectedPlayerName.toLowerCase());

    // Check if either player1name or player2name matches
    return player1Match || player2Match;
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  function getMatches() {
    const day = selectedDate["$D"]; // Day (1-31)
    const month = selectedDate["$M"] + 1; // Month (0-11) + 1 to make it (1-12)
    const year = selectedDate["$y"]; // Year (e.g., 2023)
    const dat = `${year}-${month}-${day}`;

    axios
      .get(`/singleMatch?date=${dat}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.data;
      })
      .then((data) => {
        setMeczes(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    getMatches();
  }, [selectedDate]);

  return (
    <>
      <div className="container">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              label="Wybierz date"
            />
          </DemoContainer>
        </LocalizationProvider>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          p={2}
          sx={{ width: "100%" }}
        >
          {" "}
          {meczes.length > 10 ? (
            <TextField
              size="small"
              id="outlined-basic"
              label="nazwisko..."
              variant="outlined"
              value={selectedPlayerName}
              autoComplete="off"
              onChange={handleFilterChange}
              component={Paper}
              sx={{
                width: "100%",
                boxShadow: 10,
                minWidth: 350,
                maxWidth: 825,
              }}
            />
          ) : null}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            minWidth: 350,
          }}
          p={1}
        >
          <Grid
            container
            spacing={3}
            style={{
              width: "100%",
              justifyContent: "center",
              maxWidth: 840,
            }}
          >
            {filteredData.map((mecz, index) => {
              let borderColor = null;
              let backgroundColor = null;

              if (mecz.player1sets === 3 || mecz.player2sets === 3) {
                backgroundColor = "#dbead5";
                borderColor = "#80cbc4";
              }

              return (
                <Grid
                  item
                  xs="auto"
                  key={index}
                  style={{
                    justifyContent: "center",
                    width: "100%",
                    maxWidth: 420,
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    sx={{ width: "100%" }}
                  >
                    <Item>
                      {" "}
                      <TableContainer component={Paper} sx={{ boxShadow: 10 }}>
                        <Table
                          sx={{
                            width: "100%",
                            backgroundColor: backgroundColor,
                          }}
                          aria-label="simple table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                colSpan="2"
                                sx={{ borderColor: borderColor }}
                              >
                                Mecz {index + 1}{" "}
                              </TableCell>

                              <TableCell
                                align="right"
                                sx={{ borderColor: borderColor }}
                              ></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell sx={{ borderColor: borderColor }}>
                                {mecz.player1name}
                              </TableCell>
                              <TableCell sx={{ borderColor: borderColor }}>
                                {mecz.player1sets}
                              </TableCell>
                              <TableCell
                                rowSpan={2}
                                sx={{ border: 0 }}
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  textAlign: "center",
                                }}
                              >
                                {" "}
                                <MatchModal
                                  onRefresh={getMatches}
                                  meczid={mecz._id}
                                  player1={mecz.player1name}
                                  player2={mecz.player2name}
                                  player1id={mecz.player1id}
                                  player2id={mecz.player2id}
                                  player1sets={mecz.player1sets}
                                  player2sets={mecz.player2sets}
                                />
                              </TableCell>
                            </TableRow>

                            <TableRow
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell>{mecz.player2name}</TableCell>
                              <TableCell>{mecz.player2sets}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Item>
                  </Box>
                </Grid>
              );
            })}{" "}
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default Match;
