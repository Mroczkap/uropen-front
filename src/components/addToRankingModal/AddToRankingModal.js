import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  minWidth: 250,
  pt: 5,
  px: 4,
  pb: 3,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  display: "flex", // Use flex container
  flexDirection: "column", // Stack items vertically
  justifyContent: "center", // Vertically center align content
  alignItems: "center", // Horizontally center align content
  color: theme.palette.text.secondary,
  minWidth: 300,
  height: 55,
}));

export default function AddToRankingModal({ idzawodow }) {
  const [open, setOpen] = useState(false);
  const [rankingi, setRankingi] = useState([]);
  const [nazwa, setNazwa] = useState("");
  const [data, setData] = useState("");
  const [idrankingu, setIdrankingu] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
  const handleRanking = (event) => {
    const data = {
      idzawodow: idzawodow,
      idrankingu: idrankingu,
    };
    if (idrankingu === "") {
      toast.error("Wybierz rankig!");
    } else {
      axios
        .post(`rankings`, data, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials in the request
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success("Wyniki dodane do rankingu");
          } else if (response.status === 203) {
            toast.error("Wyniki już są w rankingu");
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  };

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

  const ButtonModal = () => {
    return (
      <>
        <Button variant="outlined" onClick={handleOpen}>
          Dodaj wyniki do rankigu
        </Button>
      </>
    );
  };
  return (
    <>
      <div>
        <ButtonModal />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box
            sx={{
              ...style,
              display: "flex",
              justifyContent: "center",
              maxWidth: 350,
            }}
          >
            <Grid container spacing={1} style={{ justifyContent: "center" }}>
              <Grid item xs="auto" p={1}>
                <Item>
                  {" "}
                  <Autocomplete
                    disablePortal
                    onChange={handleInputChange}
                    options={rankingi}
                    getOptionLabel={(option) => option.nazwarankingu}
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField {...params} label={"Wybierz ranking"} />
                    )}
                  />
                </Item>
              </Grid>

              <Grid item xs="auto" p={1}>
                <Item>
                  {" "}
                  <Typography variant="button">
                    <b> Nazwa rankingu:</b> {nazwa} <br />{" "}
                    <b>Data rankingu: </b>
                    {data}
                  </Typography>
                </Item>
              </Grid>

              <Grid item xs="auto" p={1}>
                <Item>
                  {" "}
                  <Button variant="outlined" onClick={handleRanking}>
                    Dodaj do rankingu
                  </Button>
                </Item>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </div>
    </>
  );
}
