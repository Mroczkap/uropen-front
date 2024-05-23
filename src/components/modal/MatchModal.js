import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useState } from "react";
import "./Modal.css";
import axios from "../../api/axios";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  minWidth: 390,
  maxWidth: 420,
  pt: 3,
  px: 3,
  pb: 2,
};

export default function RemoveModal({
  meczid,
  player1,
  player1id,
  player2id,
  player2,
  onRefresh,
  groupid,
  runda,
  idzawodow,
  idmeczu,
  player1sets,
  player2sets,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [counterSet1, setCounterSet1] = useState(player1sets);
  const [counterSet2, setCounterSet2] = useState(player2sets);
  let buttonType = 1;

  if (player1 === "Wolny Los" || player2 === "Wolny Los") {
    buttonType = 2;
  }

  if (!player1id || !player2id) {
    buttonType = 0;
  }
  const handleSetValueSet1 = (value) => {
    setCounterSet1(value);
  };

  const handleSetValueSet2 = (value) => {
    setCounterSet2(value);
  };

  const handleClick = () => {
    const data = [
      meczid,
      counterSet1,
      counterSet2,
      groupid,
      runda,
      player1id,
      player2id,
      idzawodow,
      idmeczu,
    ];

    axios
      .put(`saveRoundmatch`, data, {
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
  };
  const handleLogCounters = () => {
    if (counterSet1 === player1sets && counterSet2 === player2sets) {
      setIsOpen(false);
    } else {
      const data = [
        meczid,
        counterSet1,
        counterSet2,
        groupid,
        runda,
        player1id,
        player2id,
        idzawodow,
        idmeczu,
      ];

      if (counterSet1 === 3 && counterSet2 === 3) {
        toast.error("Wprowadzono złą wartość");
      } else {
        if (groupid) {
          axios
            .post(`saveGroupmatch`, data, {
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
        } else {
          axios
            .post(`saveRoundmatch`, data, {
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
        }
        setIsOpen(false);
        toast.success("Pomyślnie rozegrano mecz");
      }
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const ButtonModal = () => {
    return (
      <>
        {buttonType === 0 ? (
          <Button variant="outlined" color="success">
            {" "}
            Oczekiwanie
          </Button>
        ) : null}
        {buttonType === 1 ? (
          <Button variant="outlined" onClick={openModal}>
            Dodaj <br />
            wynik
          </Button>
        ) : null}
        {buttonType === 2 ? (
          <Button variant="outlined" color="error" onClick={handleClick}>
            Przelicz
          </Button>
        ) : null}
      </>
    );
  };
  return (
    <>
      <div>
        <ButtonModal />
        <Modal
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style, justifyContent: "center" }}>
            <div>
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
    </>
  );
}
