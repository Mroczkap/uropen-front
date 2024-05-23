import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import MatchModal from "./modal/MatchModal";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "../api/axios";
import Switch from "@mui/material/Switch";

const Runda = ({ meczeRund, onRefresh, runda, idzawodow, typ, isLoggedIn }) => {
  const splitIndex = Math.ceil(meczeRund.length / 2);
  const arrayPart1 = meczeRund.slice(0, splitIndex);
  const arrayPart2 = meczeRund.slice(splitIndex);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const mecze = [];

  const goNext = (
    meczid,
    counterSet1,
    counterSet2,
    groupid,
    runda,
    player1id,
    player2id,
    idzawodow,
    idmeczu,
    saved
  ) => {
    if (!saved) {
      const data = [
        meczid,
        counterSet1,
        counterSet2,
        groupid,
        runda,
        player1id,
        player2id,
        idzawodow,
        idmeczu,
      ];

      const index = mecze.indexOf(idmeczu);

      if (index !== -1) {
        console.log(`Found at index ${index}`); // Output: Found at index 2
      } else {
        mecze.push(idmeczu);
        axios
          .put(`saveRoundmatch`, data, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // Include credentials in the request
          })
          .then((response) => {
            onRefresh();
            return response.data;
          })
          .catch((error) => {
            console.error("An error occurred:", error);
          });
      }
    }
  };

  const progress = (matchId, inProgress) => {
    let data = [matchId, inProgress];
    axios
      .put(`singleMatch`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then(() => {
        onRefresh();
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const Item = styled(Paper)(({ theme }) => ({
    textAlign: "center",

    minWidth: 350,
  }));

  const przedzialMeczu = (idmeczu, runda) => {
    let nazwa;
    switch (runda) {
      case "1/4":
        nazwa = `Mecz ${idmeczu}`;
        break;
      case "1/2":
        const array = ["error", "1-8", "9-16", "17-24", "25-32"];
        const index = parseInt(idmeczu / 4 + 0.75);
        nazwa = `Mecz w przedziale miejsc: ${array[index]}`;
        break;
      case "final":
        const array2 = [
          "error",
          "1-4",
          "5-8",
          "9-12",
          "13-16",
          "17-20",
          "21-24",
          "25-28",
          "29-32",
        ];
        const index2 = parseInt(idmeczu / 2 + 0.5);
        nazwa = `Mecz w przedziale miejsc: ${array2[index2]}`;
        break;
      case "wyniki":
        nazwa = `Mecz o miejsce ${2 * idmeczu - 1}`;
        break;
      default:
        console.log(`Sorry, we are out of ${runda}.`);
    }

    return nazwa;
  };

  return (
    <>
      <Box sx={{}}>
        <Box
          sx={{
            borderBottom: 2,
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              label={`Miejsca 1 - ${splitIndex * 2}`}
              {...a11yProps(0)}
              key={0}
            />
            <Tab
              label={`Miejsca ${splitIndex * 2 + 1} - ${splitIndex * 4}`}
              {...a11yProps(1)}
              key={1}
            />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0} key={0}>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Grid
              container
              spacing={3}
              style={{ width: "70%", justifyContent: "center" }}
            >
              {arrayPart1.map((mecz) => {
                const handleSwitchClick = () => {
                  if (mecz.inprogress) {
                    progress(mecz._id, false);
                  } else {
                    progress(mecz._id, true);
                  }
                };

                let borderColor = null;
                let backgroundColor = null;
                let checked = false;
                if (
                  mecz.player1sets === 3 ||
                  mecz.player2sets === 3 ||
                  mecz.saved === true
                ) {
                  backgroundColor = "#dbead5";
                  borderColor = "#80cbc4";
                  checked = false;
                } else if (mecz.inprogress) {
                  backgroundColor = "#ffa08e";
                  borderColor = "#ef5350"; // Use the desired background color for highlighted matches
                  checked = true;
                }

                return (
                  // Render individual player rows within the group
                  mecz.player1name === "Wolny Los" &&
                    mecz.player2name === "Wolny Los" ? null : (
                    <>
                      <Grid item xs="auto" key={mecz._id}>
                        <Item>
                          {" "}
                          <TableContainer
                            component={Paper}
                            sx={{ maxWidth: 600, boxShadow: 10 }}
                          >
                            <Table
                              sx={{
                                minWidth: 200,
                                backgroundColor: backgroundColor,
                              }}
                              aria-label="simple table"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    colSpan="2"
                                    sx={{ borderColor: borderColor }}
                                  >
                                    {przedzialMeczu(mecz.idmeczu, runda)}{" "}
                                  </TableCell>
                                  <TableCell
                                    sx={{ borderColor: borderColor }}
                                    align="right"
                                  >
                                    {" "}
                                    {isLoggedIn ? (
                                      <Switch
                                        checked={checked}
                                        onChange={handleSwitchClick}
                                      />
                                    ) : null}
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell sx={{ borderColor: borderColor }}>
                                    {mecz.player1name}
                                  </TableCell>
                                  <TableCell sx={{ borderColor: borderColor }}>
                                    {mecz.player1sets}
                                  </TableCell>
                                  <TableCell
                                    rowSpan={2}
                                    style={{
                                      justifyContent: "center",
                                      alignItems: "center",
                                      textAlign: "center",
                                      border: 0,
                                    }}
                                  >
                                    {" "}
                                    {isLoggedIn ? (
                                      <MatchModal
                                        onRefresh={onRefresh}
                                        meczid={mecz._id}
                                        player1={mecz.player1name}
                                        player2={mecz.player2name}
                                        player1id={mecz.player1id}
                                        player2id={mecz.player2id}
                                        idzawodow={idzawodow}
                                        runda={runda}
                                        idmeczu={mecz.idmeczu}
                                        player1sets={mecz.player1sets}
                                        player2sets={mecz.player2sets}
                                      />
                                    ) : null}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell style={{ border: 0 }}>
                                    {mecz.player2name}{" "}
                                  </TableCell>
                                  <TableCell style={{ border: 0 }}>
                                    {mecz.player2sets}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Item>
                      </Grid>
                    </>
                  )
                );
              })}
            </Grid>
          </Box>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1} key={1}>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Grid
              container
              spacing={3}
              style={{ width: "70%", justifyContent: "center" }}
            >
              {arrayPart2.map((mecz) => {
                const handleSwitchClick = () => {
                  if (mecz.inprogress) {
                    progress(mecz._id, false);
                  } else {
                    progress(mecz._id, true);
                  }
                };
                let borderColor = null;
                let backgroundColor = null;
                let checked = false;
                if (
                  mecz.player1sets === 3 ||
                  mecz.player2sets === 3 ||
                  mecz.saved === true
                ) {
                  backgroundColor = "#dbead5";
                  borderColor = "#80cbc4";
                  checked = false;
                } else if (mecz.inprogress) {
                  backgroundColor = "#ffa08e";
                  borderColor = "#ef5350"; // Use the desired background color for highlighted matches
                  checked = true;
                }
                return (
                  // Render individual player rows within the group
                  mecz.player1name === "Wolny Los" &&
                    mecz.player2name === "Wolny Los" ? (
                    goNext(
                      mecz._id,
                      null,
                      null,
                      null,
                      runda,
                      mecz.player1id,
                      mecz.player2id,
                      idzawodow,
                      mecz.idmeczu,
                      mecz.saved
                    )
                  ) : (
                    <>
                      <Grid item xs="auto" key={mecz._id}>
                        <Item>
                          {" "}
                          <TableContainer
                            component={Paper}
                            sx={{ maxWidth: 600, boxShadow: 10 }}
                          >
                            <Table
                              sx={{
                                minWidth: 200,
                                backgroundColor: backgroundColor,
                              }}
                              aria-label="simple table"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    colSpan="2"
                                    sx={{ borderColor: borderColor }}
                                  >
                                    {przedzialMeczu(mecz.idmeczu, runda)}{" "}
                                  </TableCell>
                                  <TableCell
                                    sx={{ borderColor: borderColor }}
                                    align="right"
                                  >
                                    {" "}
                                    {isLoggedIn ? (
                                      <Switch
                                        checked={checked}
                                        onChange={handleSwitchClick}
                                      />
                                    ) : null}
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell sx={{ borderColor: borderColor }}>
                                    {mecz.player1name}
                                  </TableCell>
                                  <TableCell sx={{ borderColor: borderColor }}>
                                    {mecz.player1sets}
                                  </TableCell>
                                  <TableCell
                                    rowSpan={2}
                                    style={{
                                      justifyContent: "center",
                                      alignItems: "center",
                                      textAlign: "center",
                                      border: 0,
                                    }}
                                  >
                                    {" "}
                                    {isLoggedIn ? (
                                      <MatchModal
                                        onRefresh={onRefresh}
                                        meczid={mecz._id}
                                        player1={mecz.player1name}
                                        player2={mecz.player2name}
                                        player1id={mecz.player1id}
                                        player2id={mecz.player2id}
                                        idzawodow={idzawodow}
                                        runda={runda}
                                        idmeczu={mecz.idmeczu}
                                        player1sets={mecz.player1sets}
                                        player2sets={mecz.player2sets}
                                      />
                                    ) : null}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell style={{ border: 0 }}>
                                    {mecz.player2name}{" "}
                                  </TableCell>
                                  <TableCell style={{ border: 0 }}>
                                    {mecz.player2sets}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Item>
                      </Grid>
                    </>
                  )
                );
              })}
            </Grid>
          </Box>
        </CustomTabPanel>
      </Box>
    </>
  );
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default Runda;
