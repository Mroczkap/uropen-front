import React from "react";
import Box from "@mui/material/Box";
import Rankings from "../components/Rankings";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import axios from "../api/axios";

const About = () => {
  const [rankingi, setRankingi] = useState([]);
  const [nazwa, setNazwa] = useState("");
  const [data, setData] = useState("");
  const [idrankingu, setIdrankingu] = useState("");

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    justifyContent: "center",
    color: theme.palette.text.secondary,
    minWidth: 350,
    height: 90,
  }));

  function getData() {
    axios
      .put("/rankings", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.data;
      })
      .then((data) => {
        setRankingi(data);
        setIdrankingu(data[0]._id);
        setNazwa(data[0].nazwarankingu);
        setData(data[0].datautworzenia.split("T")[0]);
      })
      .catch((error) => {
        console.log(error.message);
        // Handle the error, such as displaying an error message to the user
      });
  }
  const handleInputChange = (event, newValue) => {
    const ranking = newValue._id ? newValue._id : "";
    const nazwaRankingu = newValue.nazwarankingu ? newValue.nazwarankingu : " ";
    const dataRankingu = newValue.datautworzenia
      ? newValue.datautworzenia.split("T")[0]
      : " ";
    setIdrankingu(ranking);
    setNazwa(nazwaRankingu);
    setData(dataRankingu);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="container">
        <Box sx={{ flexGrow: 1, maxWidth: 800 }}>
          <Grid container spacing={2} style={{ justifyContent: "center" }}>
            <Grid item xs="auto" p={2}>
              <Item>
                {" "}
                <Typography variant="button">
                  <b> Nazwa rankingu:</b> {nazwa} <br /> <b>Data rankingu: </b>
                  {data}
                </Typography>
              </Item>
            </Grid>

            <Grid item xs="auto" p={2}>
              <Item>
                {" "}
                <Autocomplete
                  disablePortal
                  onChange={handleInputChange}
                  options={rankingi}
                  getOptionLabel={(option) => option.nazwarankingu}
                  sx={{}}
                  renderInput={(params) => (
                    <TextField {...params} label={"Wybierz ranking"} />
                  )}
                />
              </Item>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div >
        {idrankingu !== "" && <Rankings idrankingu={idrankingu} />}
      </div>
    </>
  );
};

export default About;
