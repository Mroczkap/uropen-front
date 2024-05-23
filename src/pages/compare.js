import React from "react";
import UserComparisonChart from "../components/UserComparisonChart";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import axios from "../api/axios";
import { toast } from "react-toastify";

const Compare = () => {
  const [users, setUsers] = useState([]);
  const [chartdata, setChartdata] = useState([]);
  const [idrankingu, setIdrankingu] = useState("");
  let user1;
  let user2;

  function getData() {
    axios
    .get(`/zawodnicy?sorting=${1}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.data;
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.log(err.message);
      });

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
        setIdrankingu(data[0]._id);
      })
      .catch((error) => {
        console.log(error.message);
        // Handle the error, such as displaying an error message to the user
      });
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    justifyContent: "center",
    color: theme.palette.text.secondary,
    minWidth: 300,
    height: 55,
  }));

  const porownaj = () => {
    if (user1 && user2 && user1 !== user2) {
      const queryParams = {
        user1: user1,
        user2: user2,
        idrankingu: idrankingu,
      };

      axios
        .get(`/rankings`, {
          params: queryParams,
          withCredentials: true,
        })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(`Request failed with status: ${response.status}`);
          }
          return response.data;
        })
        .then((data) => {
          setChartdata(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      toast.error("Wybierz zawodników!");
    }
  };

  const handleInputChange = (event, selectedValue) => {
    const id = event.target.id[0];
    if (id === "1") {
      user1 = selectedValue;
    } else if (id === "2") {
      user2 = selectedValue;
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="container">
        <h1>Porównanie zawodników</h1>
      </div>
      <div className="container">
        <Box sx={{ flexGrow: 1, maxWidth: 800 }}>
          <Grid container spacing={2} style={{ justifyContent: "center" }}>
            <Grid item xs="auto" p={2}>
              <Item>
                {" "}
                <Autocomplete
                  disablePortal
                  onChange={handleInputChange}
                  options={users}
                  id="1"
                  getOptionLabel={(option) =>
                    option.nazwisko + " " + option.imie
                  }
                  sx={{}}
                  renderInput={(params) => (
                    <TextField {...params} label={"Wybierz zawodnika"} />
                  )}
                />
              </Item>
            </Grid>

            <Grid item xs="auto" p={1}>
              <Item>
                {" "}
                <Autocomplete
                  disablePortal
                  onChange={handleInputChange}
                  options={users}
                  id="2"
                  getOptionLabel={(option) =>
                    option.nazwisko + " " + option.imie
                  }
                  sx={{}}
                  renderInput={(params) => (
                    <TextField {...params} label={"Wybierz zawodnika"} />
                  )}
                />
              </Item>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div className="container">
        <Button
          variant="contained"
          onClick={porownaj}
          sx={{ width: "70%", minWidth: 330, maxWidth: 700 }}
          color="success"
        >
          Dokonaj porównania
        </Button>
      </div>
      {chartdata.length === 0 ? null : (
        <UserComparisonChart
          userData1={chartdata[0]}
          userData2={chartdata[1]}
        />
      )}
    </>
  );
};

export default Compare;
