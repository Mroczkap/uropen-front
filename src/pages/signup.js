import { toast } from "react-toastify";
import React from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import axios from "../api/axios";
import Modal from "@mui/material/Modal";
import Autocomplete from "@mui/material/Autocomplete";
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
  minWidth: 390,
  maxWidth: 800,
  pt: 3,
  px: 3,
  pb: 2,
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

const SignUp = () => {
  const [counterSet1, setCounterSet1] = useState();
  const [counterSet2, setCounterSet2] = useState();
  const { register, handleSubmit, reset } = useForm();
  const [activeGroup, setActiveGroup] = useState(null);
  const [actived, setActived] = useState(false);
  const [player1, setPlayer1] = useState();
  const [player2, setPlayer2] = useState();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const [player1id, setPlayer1id] = useState();
  const [player2id, setPlayer2id] = useState();
  const [open, setOpen] = useState(false);
  const [rankingi, setRankingi] = useState([]);
  const [nazwa, setNazwa] = useState("");
  const [data, setData] = useState("");
  const [idrankingu, setIdrankingu] = useState("");

  console.log(users);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSetValueSet1 = (value) => {
    setCounterSet1(value);
  };

  const handleSetValueSet2 = (value) => {
    setCounterSet2(value);
  };

  const findUserById = (userId) => {
    // Use the `find` method to find the user with the specified id
    const foundUser = users.find((user) => user._id === userId);

    const newUSer = `${foundUser.imie} ${foundUser.nazwisko}`;
    return newUSer;
  };

  const onSubmit = (data) => {
    if (data.zawodnicy.length === 2) {
      handleOpen();
      setPlayer1(findUserById(data.zawodnicy[0]));
      setPlayer2(findUserById(data.zawodnicy[1]));
      setPlayer1id(data.zawodnicy[0]);
      setPlayer2id(data.zawodnicy[1]);
    } else if (
      data.nazwa === "" ||
      data.zawodnicy === false ||
      activeGroup == null
    ) {
      toast.error("Podaj dane zawodów, liczbę grup oraz zawodników");
    } else if (
      data.zawodnicy.length < activeGroup * 2 + 1 ||
      data.zawodnicy.length > 32
    ) {
      toast.error(
        `Zaznaczyłeś: ${
          data.zawodnicy.length
        } zawodników, ich ilość dla ${activeGroup} grup musi mieścić się w przedziale ${
          activeGroup * 2 + 1
        }-32`
      );
    } else if (data.zawodnicy.length < 5 && activeGroup > 1) {
      toast.error(
        `Zaznaczyłeś: ${data.zawodnicy.length} zawodników oraz ${activeGroup} grup dla tej ilości zawodników zaznacz wraiant "Każdy z każdym"`
      );
    } else {
      data.selectedGroup = activeGroup;
      axios
        .post("createGame", data, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials in the request
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success("Zawody poprawnie utworzone");
            navigate("/contact");
          }
          return response.data;
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  };

  function getData() {
    axios
      .get("/zawodnicy", {
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
  }
  function getData2() {
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
    getData2();
  }, []);

  const handleGroupButtonClick = (groupNumber) => {
    setActiveGroup(groupNumber);
    if (groupNumber === 1) setActived(false);
  };

  const handleActived = () => {
    setActived(true);
    setActiveGroup(0);
  };

  const handleLogCounters = () => {
    const queryParams = {
      player1sets: parseInt(counterSet1),
      player2sets: parseInt(counterSet2),
      player1id: player1id,
      player2id: player2id,
      rankingid: idrankingu,
    };

    if (
      (counterSet1 === 3 && counterSet2 === 3) ||
      (counterSet1 !== 3 && counterSet2 !== 3)
    ) {
      toast.error("Wprowadzono złą wartość");
    } else if (idrankingu === "") {
      toast.error("Nie wybrano rankingu");
    } else {
      axios
        .post(`singleMatch`, {
          headers: {
            "Content-Type": "application/json",
          },
          params: queryParams,
          withCredentials: true, // Include credentials in the request
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
      handleClose();
      reset();
      setCounterSet1(0);
      setCounterSet2(0);
      toast.success("Pomyślnie rozegrano mecz");
    }
  };

  const UserData2 = ({ users }) => {
    const filteredData = users.filter((item) => {
      return item.nazwisko.toLowerCase().includes(filter.toLowerCase());
    });
    let lp = 0;
    return (
      <>
        {filteredData.map((curUser) => {
          const { _id, nazwisko, imie } = curUser;

          lp++;
          return (
            <TableRow
              key={`${_id}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{lp}</TableCell>
              <TableCell>{nazwisko}</TableCell>
              <TableCell>{imie}</TableCell>
              <TableCell
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <input
                  className="check"
                  value={_id}
                  type="checkbox"
                  {...register("zawodnicy")}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </>
    );
  };

  return (
    <div>
      <div className="container">
        <Typography variant="h4">Stwórz nowe zawody</Typography>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container">
          <TextField
            size="small"
            sx={{ width: "40%", minWidth: 350 }}
            type="text"
            {...register("nazwa")}
            label="Nazwa zawodów"
          />
        </div>
        <div className="container">
          {" "}
          <Button
            key={1}
            onClick={() => handleGroupButtonClick(1)}
            sx={{
              width: "40%",
              minWidth: 350,
              backgroundColor:
                activeGroup === 1 ? "primary.main" : "transparent",
              color: activeGroup === 1 ? "white" : "primary.main",
              borderColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
            variant="outlined"
          >
            Tryb rozgrywki "każdy z każdym"
          </Button>
        </div>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...style, justifyContent: "center" }}>
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
              </Grid>

              <div className="container">
                <table>
                  <tbody>
                    <tr>
                      <td width="200px">
                        <b>{player1}</b>
                      </td>
                      <td className="forbutton" align="right">
                        <button
                          onClick={() => handleSetValueSet1(0)}
                          className={counterSet1 === 0 ? "active" : ""}
                        >
                          0
                        </button>
                        <button
                          onClick={() => handleSetValueSet1(1)}
                          className={counterSet1 === 1 ? "active" : ""}
                        >
                          1
                        </button>
                        <button
                          onClick={() => handleSetValueSet1(2)}
                          className={counterSet1 === 2 ? "active" : ""}
                        >
                          2
                        </button>
                        <button
                          onClick={() => handleSetValueSet1(3)}
                          className={counterSet1 === 3 ? "active" : ""}
                        >
                          3
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>{player2}</b>
                      </td>
                      <td className="forbutton" align="right">
                        <button
                          onClick={() => handleSetValueSet2(0)}
                          className={counterSet2 === 0 ? "active" : ""}
                        >
                          0
                        </button>
                        <button
                          onClick={() => handleSetValueSet2(1)}
                          className={counterSet2 === 1 ? "active" : ""}
                        >
                          1
                        </button>
                        <button
                          onClick={() => handleSetValueSet2(2)}
                          className={counterSet2 === 2 ? "active" : ""}
                        >
                          2
                        </button>
                        <button
                          onClick={() => handleSetValueSet2(3)}
                          className={counterSet2 === 3 ? "active" : ""}
                        >
                          3
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td> </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="container">
                <button onClick={handleLogCounters}>Zapisz i zamknij</button>
              </div>
            </Box>
          </Modal>
        </div>
        <div className="container">
          <Button
            variant="outlined"
            onClick={() => handleActived()}
            sx={{
              width: "40%",
              minWidth: 350,
              backgroundColor:
                actived === true ? "primary.main" : "transparent",
              color: actived === true ? "white" : "primary.main",
              borderColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            Tryb grupowo-pucharowy:
          </Button>
        </div>
        {actived === true ? (
          <div className="container">
            <Typography gutterBottom variant="nutoo">
              Liczba grup:
            </Typography>
            {[2, 3, 4, 5, 6, 7, 8].map((groupNumber) => (
              <Button
                key={groupNumber}
                onClick={() => handleGroupButtonClick(groupNumber)}
                sx={{
                  width: "4.5%",
                  minWidth: 32,
                  margin: 0.5,
                  backgroundColor:
                    activeGroup === groupNumber
                      ? "primary.main"
                      : "transparent",
                  color: activeGroup === groupNumber ? "white" : "primary.main",
                  borderColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                }}
                variant="outlined"
              >
                {groupNumber}
              </Button>
            ))}
          </div>
        ) : null}

        <div className="container">
          <Button
            type="submit"
            color="success"
            sx={{ width: "40%", minWidth: 350 }}
            variant="contained"
          >
            Stwórz nowe zawody
          </Button>
        </div>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          sx={{ width: "100%" }}
        >
          <TableContainer
            component={Paper}
            sx={{ maxWidth: 825, boxShadow: 10, minWidth: 300 }}
          >
            <TextField
              size="small"
              sx={{ width: "96%", marginBottom: 2, marginTop: 2 }}
              id="outlined-basic"
              label="Filtruj po nazwisku"
              variant="outlined"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>L.p.</TableCell>
                  <TableCell>Nazwisko</TableCell>
                  <TableCell>Imię</TableCell>

                  <TableCell
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    Wybierz
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <UserData2 users={users} />
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </form>
    </div>
  );
};

export default SignUp;
