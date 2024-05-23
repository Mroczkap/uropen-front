import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import MatchModal from "./modal/MatchModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "../api/axios";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";

const GroupsData = ({ groups, mecze, onRefresh, idzawodow, typ, outGrups, isLoggedIn }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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

  const handleClick = (event) => {
    let data = [event.currentTarget.id, event.currentTarget.name, typ];

    axios
      .post(`finishgroup?idzawodow=${idzawodow}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 203) {
          toast.error("Nie wszystkie mecze zostały rozegrane");
        } else if (response.status === 200) {
          toast.success("Grupa poprawnie rozegrana!");
          onRefresh();
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const handleClick2 = (event) => {
    let data = [outGrups];

    axios
      .post(`finishgroupstage?idzawodow=${idzawodow}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include credentials in the request
      })
      .then((response) => {
        if (response.status === 203) {
          toast.error("Nie wszystkie mecze zostały rozegrane");
        } else if (response.status === 200) {
          toast.success("Grupay poprawnie rozegrana!");
          onRefresh();
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  function findMatches(groupid) {
    const elementsWithValue = mecze.filter(
      (number) => groupid === number.idgrupy
    );
    return elementsWithValue;
  }

  return (
    <>
      <Box sx={{ width: "100%" }}>
        {(typ !== 1 && typ !== 4) & isLoggedIn ? (
          <Button onClick={handleClick2} variant="outlined">
            Zakończ rozgrywki grupowe
          </Button>
        ) : null}
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
            variant="scrollable"
            scrollButtons="auto"
            aria-label="basic tabs example"
          >
            {groups.map((grupa) => {
              return (
                <Tab
                  key={grupa.grupid}
                  label={`Grupa ${grupa.grupid}`}
                  {...a11yProps(grupa.grupid)}
                />
              );
            })}
          </Tabs>
        </Box>

        {groups.map((group) => {
          const { _id, grupid, zawodnicy, wygrane, sety } = group;
          const meczes = findMatches(_id);
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
          return (
            <CustomTabPanel key={grupid - 1} value={value} index={grupid - 1}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                p={2}
              >
                {(typ === 1 || typ === 4) & isLoggedIn ? (
                  <Button
                    variant="outlined"
                    id={_id}
                    name={grupid}
                    onClick={handleClick}
                  >
                    Zakończ grupe
                  </Button>
                ) : null}

                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  p={2}
                  sx={{ width: "100%" }}
                >
                  <TableContainer
                    component={Paper}
                    sx={{ maxWidth: 825, boxShadow: 10, minWidth: 350 }}
                  >
                    <Table sx={{ minWidth: 200 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>L.p.</TableCell>
                          <TableCell>Zawodnik</TableCell>
                          <TableCell>W</TableCell>
                          <TableCell>S</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {zawodnicy.map((zawodnik, index) => (
                          <TableRow
                            key={`${_id}-${index}`}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {index + 1}
                            </TableCell>
                            <TableCell>{zawodnik}</TableCell>
                            <TableCell>{wygrane[index]}</TableCell>
                            <TableCell>{sety[index]}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
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
                      if (mecz.player1sets === 3 || mecz.player2sets === 3) {
                        backgroundColor = "#dbead5";
                        borderColor = "#80cbc4";
                        checked = false;
                      } else if (mecz.inprogress) {
                        backgroundColor = "#ffa08e";
                        borderColor = "#ef5350"; // Use the desired background color for highlighted matches
                        checked = true;
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
                              <TableContainer
                                component={Paper}
                                sx={{ boxShadow: 10 }}
                              >
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
                                      > {  isLoggedIn ? 
                                        <Switch
                                          checked={checked}
                                          onChange={handleSwitchClick}
                                        /> : null }
                                      </TableCell>
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
                                      <TableCell
                                        sx={{ borderColor: borderColor }}
                                      >
                                        {mecz.player1name}
                                      </TableCell>
                                      <TableCell
                                        sx={{ borderColor: borderColor }}
                                      >
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
                                        {  isLoggedIn ?  <MatchModal
                                          onRefresh={onRefresh}
                                          meczid={mecz._id}
                                          player1={mecz.player1name}
                                          player2={mecz.player2name}
                                          player1id={mecz.player1id}
                                          player2id={mecz.player2id}
                                          groupid={_id}
                                          player1sets={mecz.player1sets}
                                          player2sets={mecz.player2sets}
                                        />: null}
                                       
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
              </Box>
            </CustomTabPanel>
          );
        })}
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

export default GroupsData;
