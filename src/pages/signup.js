import React, { useState, useEffect } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  useDisclosure,
  Divider,
  Badge,
  Icon,
  ChakraProvider,
  useMediaQuery,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { FaTrophy, FaSitemap, FaPlus, FaUsers } from "react-icons/fa";

const SignUp = () => {
  const [counterSet1, setCounterSet1] = useState(0);
  const [counterSet2, setCounterSet2] = useState(0);
  const [activeGroup, setActiveGroup] = useState(null);
  const [actived, setActived] = useState(false);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [player1id, setPlayer1id] = useState("");
  const [player2id, setPlayer2id] = useState("");
  const [rankingi, setRankingi] = useState([]);
  const [nazwa, setNazwa] = useState("");
  const [data, setData] = useState("");
  const [idrankingu, setIdrankingu] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, control, setValue } = useForm();
  const selectedPlayers = useWatch({
    control,
    name: "zawodnicy",
    defaultValue: [],
  });

  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const textColor = useColorModeValue("gray.800", "white");

  const handleSetValueSet1 = (value) => {
    setCounterSet1(value);
  };

  const handleSetValueSet2 = (value) => {
    setCounterSet2(value);
  };

  const findUserById = (userId) => {
    const foundUser = users.find((user) => user._id === userId);
    return foundUser ? `${foundUser.imie} ${foundUser.nazwisko}` : "";
  };

  const onSubmit = (data) => {
    if (data.zawodnicy && data.zawodnicy.length === 2) {
      onOpen();
      setPlayer1(findUserById(data.zawodnicy[0]));
      setPlayer2(findUserById(data.zawodnicy[1]));
      setPlayer1id(data.zawodnicy[0]);
      setPlayer2id(data.zawodnicy[1]);
    } else if (
      !data.nazwa ||
      !data.zawodnicy ||
      data.zawodnicy.length === 0 ||
      activeGroup === null
    ) {
      toast.error(
        "Please provide competition data, number of groups, and players"
      );
    } else if (
      data.zawodnicy.length < activeGroup * 2 + 1 ||
      data.zawodnicy.length > 32
    ) {
      toast.error(
        `You selected ${
          data.zawodnicy.length
        } players. For ${activeGroup} groups, the number of players must be between ${
          activeGroup * 2 + 1
        } and 32`
      );
    } else if (data.zawodnicy.length < 5 && activeGroup > 1) {
      toast.error(
        `You selected ${data.zawodnicy.length} players and ${activeGroup} groups. For this number of players, select the "Round-robin" option`
      );
    } else {
      data.selectedGroup = activeGroup;
      axios
        .post("tournament", data, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success("Competition created successfully");
            navigate("/contact");
          }
          return response.data;
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  };

  const getData = () => {
    axios
      .get("/players", {
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
  };

  const getData2 = () => {
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
        setIdrankingu(data[0]._id);
        setNazwa(data[0].nazwarankingu);
        setData(data[0].datautworzenia.split("T")[0]);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleInputChange = (newValue) => {
    const ranking = newValue?._id || "";
    const nazwaRankingu = newValue?.nazwarankingu || "";
    const dataRankingu = newValue?.datautworzenia
      ? newValue.datautworzenia.split("T")[0]
      : "";
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
      toast.error("Invalid score entered");
    } else if (idrankingu === "") {
      toast.error("No ranking selected");
    } else {
      axios
        .post(`match/addSingle`, {
          headers: {
            "Content-Type": "application/json",
          },
          params: queryParams,
          withCredentials: true,
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
      onClose();
      reset();
      setCounterSet1(0);
      setCounterSet2(0);
      toast.success("Match played successfully");
    }
  };

  return (
    <ChakraProvider>
      <Container maxW="900px" py={9}>
        <VStack spacing={5} align="stretch">
          <Heading as="h1" size="xl" textAlign="center" color={accentColor}>
            Create New Competition
          </Heading>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack
              spacing={6}
              bg={bgColor}
              p={8}
              borderRadius="xl"
              boxShadow="xl"
              borderWidth={1}
              borderColor={borderColor}
            >
              <Input
                placeholder="Competition Name"
                {...register("nazwa")}
                size="lg"
                variant="flushed"
                borderColor={accentColor}
                _focus={{ borderColor: accentColor }}
              />

              <Button
                onClick={() => handleGroupButtonClick(1)}
                colorScheme="blue"
                variant={activeGroup === 1 ? "solid" : "outline"}
                size="lg"
                width="full"
                leftIcon={<Icon as={FaTrophy} />}
                _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                transition="all 0.2s"
              >
                Round-robin Tournament
              </Button>

              <Button
                onClick={handleActived}
                colorScheme="blue"
                variant={actived ? "solid" : "outline"}
                size="lg"
                width="full"
                leftIcon={<Icon as={FaSitemap} />}
                _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                transition="all 0.2s"
              >
                Group Stage + Knockout
              </Button>

              {actived && (
                <Box width="full">
                  <Text mb={2} fontWeight="bold" color={textColor}>
                    Number of groups:
                  </Text>
                  <HStack justifyContent="space-between" spacing={3}>
                    {[2, 3, 4, 5, 6, 7, 8].map((groupNumber) => (
                      <Button
                        key={groupNumber}
                        onClick={() => handleGroupButtonClick(groupNumber)}
                        colorScheme="blue"
                        variant={
                          activeGroup === groupNumber ? "solid" : "outline"
                        }
                        size="lg"
                        flex={1}
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "sm",
                        }}
                        transition="all 0.2s"
                      >
                        {groupNumber}
                      </Button>
                    ))}
                  </HStack>
                </Box>
              )}

              <Divider my={1} borderColor={accentColor} />

              <Button
                type="submit"
                colorScheme="green"
                size="lg"
                width="full"
                leftIcon={<Icon as={FaPlus} />}
                _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                transition="all 0.2s"
              >
                Create Competition
              </Button>
            </VStack>
          </form>

          <Box
            bg={bgColor}
            borderWidth={1}
            borderColor={borderColor}
            borderRadius="xl"
            shadow="xl"
            overflow="hidden"
          >
            <Flex align="center" justify="space-between" bg={accentColor} p={4}>
              <HStack>
                <Icon as={FaUsers} color="white" />
                <Heading size="md" color="white">
                  Participants
                </Heading>
              </HStack>
              <Badge colorScheme="green" fontSize="md" p={2} borderRadius="md">
                Selected: {selectedPlayers.length}
              </Badge>
            </Flex>
            <Input
              placeholder="Filter by surname"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              m={4}
              variant="flushed"
              borderColor={accentColor}
              _focus={{ borderColor: accentColor }}
            />
            <Table variant="simple">
              <Thead bg={accentColor}>
                <Tr>
                  <Th color="white">No.</Th>
                  <Th color="white">Surname</Th>
                  <Th color="white">Name</Th>
                  <Th color="white" textAlign="center">
                    Select
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {users
                  .filter((item) =>
                    item.nazwisko.toLowerCase().includes(filter.toLowerCase())
                  )
                  .map((user, index) => (
                    <Tr
                      key={user._id}
                      _hover={{ bg: "blue.100" }}
                      transition="background-color 0.2s"
                      bg={
                        selectedPlayers.includes(user._id)
                          ? "blue.100"
                          : "transparent"
                      }
                      cursor="pointer"
                      onClick={() => {
                        if (isMobile) {
                          const updatedValue = selectedPlayers.includes(
                            user._id
                          )
                            ? selectedPlayers.filter((id) => id !== user._id)
                            : [...selectedPlayers, user._id];
                          setValue("zawodnicy", updatedValue);
                        }
                      }}
                    >
                      <Td>{index + 1}</Td>
                      <Td>{user.nazwisko}</Td>
                      <Td>{user.imie}</Td>
                      <Td textAlign="center">
                        <Controller
                          name="zawodnicy"
                          control={control}
                          defaultValue={[]}
                          render={({ field }) => (
                            <Checkbox
                              isChecked={field.value.includes(user._id)}
                              onChange={(e) => {
                                const updatedValue = e.target.checked
                                  ? [...field.value, user._id]
                                  : field.value.filter((id) => id !== user._id);
                                field.onChange(updatedValue);
                              }}
                              colorScheme="blue"
                              opacity={isMobile ? 0 : 1} // Hide checkbox on mobile, but keep it functional
                              pointerEvents={isMobile ? "none" : "auto"} // Disable pointer events on mobile
                            />
                          )}
                        />
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
        </VStack>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent borderRadius="xl" overflow="hidden">
            <ModalHeader bg={accentColor} color="white">
              Match Result
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={6}>
              <VStack spacing={6} align="stretch">
                <Select
                  options={rankingi}
                  getOptionLabel={(option) => option.nazwarankingu}
                  onChange={handleInputChange}
                  placeholder="Select Ranking"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderColor: accentColor,
                      "&:hover": {
                        borderColor: accentColor,
                      },
                    }),
                  }}
                />
                <HStack justify="space-between">
                  <Badge colorScheme="blue" p={2} borderRadius="md">
                    <Text>
                      <strong>Ranking Name:</strong> {nazwa || "N/A"}
                    </Text>
                  </Badge>
                  <Badge colorScheme="green" p={2} borderRadius="md">
                    <Text>
                      <strong>Ranking Date:</strong> {data || "N/A"}
                    </Text>
                  </Badge>
                </HStack>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  {[
                    {
                      name: player1,
                      counter: counterSet1,
                      setCounter: handleSetValueSet1,
                    },
                    {
                      name: player2,
                      counter: counterSet2,
                      setCounter: handleSetValueSet2,
                    },
                  ].map((player, index) => (
                    <VStack
                      key={index}
                      p={4}
                      bg="gray.50"
                      borderRadius="md"
                      boxShadow="sm"
                      spacing={4}
                    >
                      <Text fontWeight="bold" fontSize="lg">
                        {player.name}
                      </Text>
                      <HStack>
                        {[0, 1, 2, 3].map((value) => (
                          <Button
                            key={value}
                            onClick={() => player.setCounter(value)}
                            colorScheme={
                              player.counter === value ? "blue" : "gray"
                            }
                            size="md"
                            _hover={{
                              transform: "translateY(-2px)",
                              boxShadow: "sm",
                            }}
                            transition="all 0.2s"
                          >
                            {value}
                          </Button>
                        ))}
                      </HStack>
                    </VStack>
                  ))}
                </Grid>
                <Button
                  onClick={handleLogCounters}
                  colorScheme="green"
                  size="lg"
                  width="full"
                  _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                  transition="all 0.2s"
                >
                  Save and Close
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </ChakraProvider>
  );
};

export default SignUp;
