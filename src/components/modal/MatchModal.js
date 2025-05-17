import React, { useState } from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import "./Modal.css";

const RemoveModal = ({
  toRank,
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
}) => {
  console.log("runda",runda)
  console.log("idzawodow",idzawodow)
  console.log("idmeczu", idmeczu)
  const {isOpen, onOpen, onClose } = useDisclosure();
  const [counterSet1, setCounterSet1] = useState(player1sets);
  const [counterSet2, setCounterSet2] = useState(player2sets);
  let buttonType = 1;

  if (player1 === "Wolny Los" || player2 === "Wolny Los") {
    buttonType = 2;
  }

  if (!player1id || !player2id) {
    buttonType = 0;
  }

  if(toRank) buttonType = 3;

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
      .post(`match/freeMatch`, data, {
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
      onClose();
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
        toRank
      ];

      if (counterSet1 === 3 && counterSet2 === 3) {
        toast.error("Wprowadzono złą wartość");
      } else {
        if (groupid) {
          axios
            .post(`groups/save-match`, data, {
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
            .post(`match/saveMatch`, data, {
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
        onClose();
        toast.success("Pomyślnie rozegrano mecz");
      }
    }
  };

  return (
    <>
      <Box>
        {buttonType === 0 && (
          <Button colorScheme="green" variant="outline" size='sm'>
            Oczekiwanie
          </Button>
        )}
        {buttonType === 1 && (
          <Button colorScheme="blue" onClick={onOpen} size='sm'>
            Dodaj wynik
          </Button>
        )}
        {buttonType === 2 && (
          <Button colorScheme="red" variant="outline" onClick={handleClick} size='sm'>
            Przelicz
          </Button>
        )}

         {//TODO usuwanie single meczu 
         buttonType === 3 && (
          <Button colorScheme="red" size='sm'>
            Usuń mecz
          </Button>
        )}
      </Box>
      <Modal 
  isOpen={isOpen} 
  onClose={onClose}
  isCentered // This centers the modal vertically
  motionPreset="slideInBottom" // Optional: adds a nice animation
>
  <ModalOverlay />
  <ModalContent
    width="90%" // Adjust as needed
    maxWidth="500px" // Adjust as needed
  >
    <ModalHeader>Dodaj wynik</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="bold">{player1}</Text>
                <HStack>
                  {[0, 1, 2, 3].map((value) => (
                    <Button
                      key={value}
                      onClick={() => handleSetValueSet1(value)}
                      colorScheme={counterSet1 === value ? "teal" : "gray"}
                    >
                      {value}
                    </Button>
                  ))}
                </HStack>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">{player2}</Text>
                <HStack>
                  {[0, 1, 2, 3].map((value) => (
                    <Button
                      key={value}
                      onClick={() => handleSetValueSet2(value)}
                      colorScheme={counterSet2 === value ? "teal" : "gray"}
                    >
                      {value}
                    </Button>
                  ))}
                </HStack>
              </HStack>
            </VStack>
            </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" onClick={handleLogCounters}>
        Zapisz i zamknij
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </>
  );
};

export default RemoveModal;