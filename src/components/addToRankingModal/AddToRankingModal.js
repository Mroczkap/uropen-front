import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  useDisclosure,
  Select,
  Box,
  ChakraProvider,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import axios from "../../api/axios";

export default function AddToRankingModal({ idzawodow }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rankingi, setRankingi] = useState([]);
  const [selectedRanking, setSelectedRanking] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    axios
      .put("/rankings", { withCredentials: true })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.data;
      })
      .then(setRankingi)
      .catch((error) => console.log(error.message));
  }

  const handleRanking = () => {
    if (!selectedRanking) {
      toast.error("Wybierz ranking!");
      return;
    }

    const data = {
      idzawodow: idzawodow,
      idrankingu: selectedRanking._id,
    };

    axios
      .post(`rankings`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Wyniki dodane do rankingu");
          onClose(); // Close the modal after successful addition
        } else if (response.status === 203) {
          toast.error("Wyniki już są w rankingu");
        }
      })
      .catch((error) => console.error("An error occurred:", error));
  };

  return (
    <ChakraProvider>
      <Button colorScheme="blue" onClick={onOpen}>
        Dodaj wyniki do rankingu
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dodaj do rankingu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Select
                placeholder="Wybierz ranking"
                onChange={(e) => {
                  const selected = rankingi.find(
                    (r) => r._id === e.target.value
                  );
                  setSelectedRanking(selected);
                }}
              >
                {rankingi.map((ranking) => (
                  <option key={ranking._id} value={ranking._id}>
                    {ranking.nazwarankingu}
                  </option>
                ))}
              </Select>

              {selectedRanking && (
                <Box borderWidth={1} borderRadius="md" p={3}>
                  <Text>
                    <strong>Nazwa rankingu:</strong> {selectedRanking.nazwarankingu}
                  </Text>
                  <Text>
                    <strong>Data rankingu:</strong>{" "}
                    {new Date(selectedRanking.datautworzenia).toLocaleDateString()}
                  </Text>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={handleRanking}>
              Dodaj do rankingu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}