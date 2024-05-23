import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import AddModal from "../components/addModal/AddModal";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import RemoveModal from "./removeModal/RemoveModal";

import React from "react";

const UserData = ({ users, onRefresh }) => {
  const [filter, setFilter] = useState("");

  const Item = styled(Paper)({
    flex: 1, // Make the Item component flexible
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    minHeight: 90, // Use minHeight instead of height
    minWidth: 300,
    maxWidth: "100%", // Set maxWidth to allow flexible width
  });

  const filteredData = users.filter((item) => {
    return item.nazwisko.toLowerCase().includes(filter.toLowerCase());
  });

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  let lp = 0;
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        marginTop={2}
        sx={{ width: "100%" }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          style={{ justifyContent: "center" }}
        >
          <Grid item xs="auto">
            <Item
              sx={{
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {" "}
              <Typography variant="button">Filtruj po nazwisku: </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                label="nazwisko..."
                variant="outlined"
                value={filter}
                autoComplete="off"
                onChange={handleFilterChange}
                autoFocus={true}
              />
            </Item>
          </Grid>
          <Grid item xs="auto">
            <Item sx={{ boxShadow: 3 }}>
              {" "}
              <AddModal onRefresh={onRefresh} />
            </Item>
          </Grid>
        </Grid>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        marginTop={2}
        sx={{ width: "100%" }}
      >
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 1000, boxShadow: 10, minWidth: 350 }}
        >
          <Table sx={{ minWidth: 200 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>L.p.</TableCell>
                <TableCell>Ranking</TableCell>
                <TableCell>Nazwisko</TableCell>
                <TableCell>Imię</TableCell>
                <TableCell>Płeć</TableCell>
                <TableCell>Wiek</TableCell>
                <TableCell>Okładziny</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((curUser) => {
                const { _id, ranking, nazwisko, imie, plec, wiek, okladziny } =
                  curUser;
                lp++;

                return (
                  <TableRow
                    key={`${_id}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {lp}
                    </TableCell>
                    <TableCell>{ranking}</TableCell>
                    <TableCell>{nazwisko}</TableCell>
                    <TableCell>{imie}</TableCell>
                    <TableCell>{plec}</TableCell>
                    <TableCell>{wiek}</TableCell>
                    <TableCell>{okladziny}</TableCell>
                    <TableCell>
                      {" "}
                      {/* <Button
                        id={`${_id}`}
                        startIcon={<DeleteIcon />}
                        variant="outlined"
                        onClick={handleClick}
                      >
                        Usuń
                      </Button> */}
                      <RemoveModal
                        onRefresh={onRefresh}
                        id={`${_id}`}
                        imie={`${imie}`}
                        nazwisko={`${nazwisko}`}
                      />
                    </TableCell>
                    <TableCell>
                      {" "}
                      <AddModal
                        edit={true}
                        user={curUser}
                        onRefresh={onRefresh}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
export default UserData;
