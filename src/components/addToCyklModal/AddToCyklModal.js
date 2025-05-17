import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  useDisclosure,
  Select,
  Box,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import axios from "../../api/axios";

export default function AddToCyklModal({ idzawodow }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cykle, setCykle] = useState([]);
  const [selectedCykl, setSelectedCykl] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    axios
      .get("/cycles/list", { withCredentials: true })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.data;
      })
      .then(setCykle)
      .catch((error) => console.log(error.message));
  }

  const handleAddToCykl = () => {
    if (!selectedCykl) {
      toast.error("Wybierz cykl!");
      return;
    }

    const data = {
      idzawodow: idzawodow,
      idrankingu: selectedCykl._id,
    };

    axios
      .post(`cycles/add`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Wyniki dodane do cyklu");
          onClose(); // Close the modal after successful addition
        } else if (response.status === 203) {
          toast.error("Wyniki już są w cyklu");
        }
      })
      .catch((error) => console.error("An error occurred:", error));
  };

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Dodaj wyniki do cyklu
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dodaj do cyklu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch" pb={4}>
              <Select
                placeholder="Wybierz cykl"
                onChange={(e) => {
                  const selected = cykle.find(
                    (c) => c._id === e.target.value
                  );
                  setSelectedCykl(selected);
                }}
              >
                {cykle.map((cykl) => (
                  <option key={cykl._id} value={cykl._id}>
                    {cykl.nazwacyklu}
                  </option>
                ))}
              </Select>

              {selectedCykl && (
                <Box borderWidth={1} borderRadius="md" p={3}>
                  <Text>
                    <strong>Nazwa cyklu:</strong> {selectedCykl.nazwacyklu}
                  </Text>
                </Box>
              )}

              <Button colorScheme="green" onClick={handleAddToCykl}>
                Dodaj do cyklu
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}