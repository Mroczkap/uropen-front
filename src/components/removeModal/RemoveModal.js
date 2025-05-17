import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import axios from "../../api/axios";

export default function RemoveModal({ onRefresh, id, imie, nazwisko, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = () => {
    axios
      .delete(`players?id=${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then(() => {
        onRefresh();
        toast.success("Zawodnik usunięty");
        onClose();
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Potwierdź usunięcie</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Czy jesteś pewien, że chcesz usunąć zawodnika{" "}
              <strong>
                {imie} {nazwisko}
              </strong>
              ?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete}>
              Usuń
            </Button>
            <Button variant="ghost" onClick={onClose}>Anuluj</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}