import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import axios from "../../api/axios";

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

export default function AddModal({ edit, onRefresh, user }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [zaw, setZaw] = useState({});

  const [label, setLabel] = useState("Dodaj zawodnika");

  const handleOpen = () => {
    setOpen(true);
    if (edit) {
      setZaw({
        ...zaw,
        imie: user.imie,
        nazwisko: user.nazwisko,
        plec: user.plec,
        wiek: user.wiek,
        okladziny: user.okladziny,
        ranking: user.ranking,
        id: user._id,
      });
      setLabel("Zapisz zmiany");
    }

    // seImie(user.imie)
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (data) => {
     if (data.firstname.length === 0 || data.secondname.length === 0) {
      setError("Fileld is required.");
      toast.error("Nie wszystkie wymagane pola zostały uzupełnione");
      return;
    } else {
      setError(null);
    }

    if (edit) {
      axios
        .put(`zawodnicy?id=${zaw.id}`, data, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials in the request
        })
        .then((response) => {
          onRefresh();
          reset();
          return response.data;
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });

      toast.success("Dane zawodnika zostały zaktualizowane!");
    } else {
      axios
        .post("zawodnicy", data, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials in the request
        })
        .then((response) => {
          onRefresh();
          reset();
          return response.data;
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });

      toast.success("Zawodnik dodany!");
    }

    setOpen(false);
  };

  const ButtonModal = ({ edit }) => {
    if (!edit) {
      return (
        <>
          <Button variant="outlined" onClick={handleOpen}>
            Dodaj zawodnika
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button
            variant="outlined"
            onClick={handleOpen}
            startIcon={<SendIcon />}
          >
            Edytuj
          </Button>
        </>
      );
    }
  };
  return (
    <>
      <div>
        <ButtonModal edit={edit} />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style, display: "flex", justifyContent: "center" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <FormControl>
                        <TextField
                          error={error}
                          helperText="*Pole obowiązkowe."
                          defaultValue={zaw.imie}
                          id="outlined-basic"
                          label="Imię"
                          variant="outlined"
                          {...register("firstname")}
                          required
                        />
                      </FormControl>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <TextField
                        error={error}
                        defaultValue={zaw.nazwisko}
                        helperText="*Pole obowiązkowe."
                        id="outlined-basic"
                        label="Nazwisko"
                        variant="outlined"
                        {...register("secondname")}
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <TextField
                        defaultValue={zaw.plec}
                        id="outlined-basic"
                        label="Płeć"
                        variant="outlined"
                        {...register("gender")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <TextField
                        defaultValue={zaw.wiek}
                        type="number"
                        id="outlined-basic"
                        label="Wiek"
                        variant="outlined"
                        {...register("old")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <TextField
                        defaultValue={zaw.okladziny}
                        id="outlined-basic"
                        label="Okładziny"
                        variant="outlined"
                        {...register("palete")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <TextField
                        defaultValue={zaw.ranking}
                        type="number"
                        id="outlined-basic"
                        label="Ranking"
                        variant="outlined"
                        {...register("ranking")}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <center>
                <p>
                  <Button onClick={handleSubmit(onSubmit)} variant="outlined">
                    {label}
                  </Button>
                </p>
                <p>
                  <Button onClick={handleClose} variant="outlined">
                    Anuluj
                  </Button>
                </p>
              </center>
            </form>
          </Box>
        </Modal>
      </div>
    </>
  );
}
