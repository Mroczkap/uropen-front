import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
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

export default function RemoveModal({ onRefresh, id, imie, nazwisko }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (event) => {
    axios
      .delete(`zawodnicy?id=${id}`, {
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

    toast.success("Zawodnik usunięty");
    setOpen(false);
  };

  const ButtonModal = () => {
    return (
      <>
        <Button
          startIcon={<DeleteIcon />}
          variant="outlined"
          onClick={handleOpen}
        >
          Usuń
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
          <Box sx={{ ...style, display: "flex", justifyContent: "center" }}>
            <center>
              <Typography variant="h6">
                Czy jesteś pewien, że chcesz usunąć <br />
                zawodnika{" "}
                <b>
                  {imie} {nazwisko} ?
                </b>
              </Typography>
              <p>
                <Button
                  onClick={handleClick}
                  variant="outlined"
                  sx={{ margin: 1 }}
                >
                  Tak
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="error"
                  sx={{ margin: 1 }}
                >
                  Nie
                </Button>
              </p>
            </center>
          </Box>
        </Modal>
      </div>
    </>
  );
}
