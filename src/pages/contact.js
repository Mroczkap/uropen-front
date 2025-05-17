import React from "react";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import OneOfEight from "../components/OneOfEight";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const Contact = () => {
  const { auth } = useAuth();

  const isLoggedIn = auth?.roles?.find((role) => "5150"?.includes(role))
    ? true
    : false;

  const [idzawodow, setIdzawodow] = useState("");

  const [turnieje, setTurnieje] = useState([]);
  const [typ, setTyp] = useState();
  const [nazwa, setNazwa] = useState();
  const [data, setData] = useState();

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
      .get("/tournament", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.data;
      })
      .then((data) => {
        setTurnieje(data);
        setIdzawodow(data[0]._id);
        setNazwa(data[0].nazwaturnieju);
        setData(data[0].dataturneju.split("T")[0]);
        setTyp(data[0].typ);
      })
      .catch((error) => {
        console.log(error.message);
        // Handle the error, such as displaying an error message to the user
      });
  }

  const handleInputChange = (event, newValue) => {
    const turniej = newValue._id ? newValue._id : "";
    const nazwaTurnieju = newValue.nazwaturnieju ? newValue.nazwaturnieju : " ";
    const dataTurnieju = newValue.dataturneju
      ? newValue.dataturneju.split("T")[0]
      : " ";
    setIdzawodow(turniej);
    setNazwa(nazwaTurnieju);
    setData(dataTurnieju);
    setTyp(newValue.typ);
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
                  <b> Nazwa zawodów:</b> {nazwa} <br /> <b>Data zawodów: </b>
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
                  options={turnieje}
                  getOptionLabel={(option) =>
                    option.nazwaturnieju + option.data
                  }
                  sx={{}}
                  renderInput={(params) => (
                    <TextField {...params} label={"Wybierz turniej"} />
                  )}
                />
              </Item>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div className="container">
        {idzawodow !== "" && (
          <OneOfEight isLoggedIn={isLoggedIn} idzawodow={idzawodow} typ={typ} />
        )}
      </div>
    </>
  );
};

export default Contact;
