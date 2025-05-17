import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "../../api/axios";

export default function AddModal({ edit, onRefresh, user, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState(null);

  console.log("user", user)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: edit ? user : {},
  });

  const onSubmit = (data) => {
    if (data.imie.length === 0 || data.nazwisko.length === 0) {
      setError("Field is required.");
      toast.error("Nie wszystkie wymagane pola zostały uzupełnione");
      return;
    }

    const url = edit ? `players?id=${user._id}` : "players";
    const method = edit ? axios.put : axios.post;

    console.log("hmmm", data)

    method(url, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then(() => {
        onRefresh();
        reset();
        toast.success(edit ? "Dane zawodnika zostały zaktualizowane!" : "Zawodnik dodany!");
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
          <ModalHeader>{edit ? "Edytuj zawodnika" : "Dodaj zawodnika"}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Imię</FormLabel>
                  <Input {...register("imie")} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Nazwisko</FormLabel>
                  <Input {...register("nazwisko")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Płeć</FormLabel>
                  <Input {...register("plec")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Wiek</FormLabel>
                  <Input type="number" {...register("wiek")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Okładziny</FormLabel>
                  <Input {...register("okladziny")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Ranking</FormLabel>
                  <Input type="number" {...register("ranking")} />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                {edit ? "Zapisz zmiany" : "Dodaj zawodnika"}
              </Button>
              <Button variant="ghost" onClick={onClose}>Anuluj</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}