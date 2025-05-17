import React from "react";
import Box from "@mui/material/Box";
import Cykle from "../components/Cykle";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import axios from "../api/axios";

const Cykl = () => {
  const [rankingi, setRankingi] = useState([]);
  const [nazwa, setNazwa] = useState("");
  const [idrankingu, setIdrankingu] = useState("");
  const [count, setCount] = useState(0);

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
      .get("/cycles/list", {
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
        setNazwa(data[0].nazwacyklu);
        setCount(data[0].count)
        
      })
      .catch((error) => {
        console.log(error.message);
        // Handle the error, such as displaying an error message to the user
      });
  }
  const handleInputChange = (event, newValue) => {
    const ranking = newValue._id ? newValue._id : "";
    const nazwaCyklu = newValue.nazwacyklu ? newValue.nazwacyklu : " ";
    setIdrankingu(ranking);
    setNazwa(nazwaCyklu);

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
              <Item >
                {" "}
                <Typography variant="button">
                  <b> Nazwa Cyklu:</b> <br /> {nazwa}
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
                  getOptionLabel={(option) => option.nazwacyklu}
                  sx={{}}
                  renderInput={(params) => (
                    <TextField {...params} label={"Wybierz cykl"} />
                  )}
                />
              </Item>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div className="container">
        {idrankingu !== "" && <Cykle idrankingu={idrankingu} count={count} />}
      </div>
    </>
  );
};

export default Cykl;
