import React from "react";
import UserComparisonChart from "../components/UserComparisonChart";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Container,
  ChakraProvider,
  useMediaQuery,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Select } from "chakra-react-select";
import axios from "../api/axios";
import { toast } from "react-toastify";

const Compare = () => {
  const [users, setUsers] = useState([]);
  const [chartdata, setChartdata] = useState([]);
  const [idrankingu, setIdrankingu] = useState("");
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  let user1;
  let user2;

  function getData() {
    axios
      .get(`/players?sorting=${1}`, {
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
        setIdrankingu(data[0]._id);
      })
      .catch((error) => {
        console.log(error.message);
        // Handle the error, such as displaying an error message to the user
      });
  }

  const porownaj = () => {
    if (user1 && user2 && user1 !== user2) {
      const queryParams = {
        user1: user1,
        user2: user2,
        idrankingu: idrankingu,
      };

      axios
        .get(`/rankings`, {
          params: queryParams,
          withCredentials: true,
        })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(`Request failed with status: ${response.status}`);
          }
          return response.data;
        })
        .then((data) => {
          setChartdata(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      toast.error("Wybierz zawodników!");
    }
  };

  const handleInputChange = (selectedValue, id) => {
    if (id === "user1") {
      user1 = selectedValue.value;
    } else if (id === "user2") {
      user2 = selectedValue.value;
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <ChakraProvider>
      <Container maxW="950px" centerContent>
        <Box textAlign="center" py={10} px={6}>
          <Text fontSize="3xl">Porównanie zawodników</Text>
        </Box>
        <VStack spacing={4} align="center" w="100%">
          <HStack
            spacing={4}
            w="100%"
            justify="center"
            flexWrap={isMobile ? "wrap" : "nowrap"}
          >
            <Box minWidth="300px" w="100%">
              <Select
                options={users.map((user) => ({
                  value: user,
                  label: `${user.nazwisko} ${user.imie}`,
                }))}
                placeholder="Wybierz zawodnika"
                onChange={(selectedValue) =>
                  handleInputChange(selectedValue, "user1")
                }
              />
            </Box>
            <Box minWidth="300px" w="100%">
              <Select
                options={users.map((user) => ({
                  value: user,
                  label: `${user.nazwisko} ${user.imie}`,
                }))}
                placeholder="Wybierz zawodnika"
                onChange={(selectedValue) =>
                  handleInputChange(selectedValue, "user2")
                }
              />
            </Box>
          </HStack>
          <Button colorScheme="green" size="lg" onClick={porownaj} w="100%">
            Dokonaj porównania
          </Button>
          {chartdata.length !== 0 && (
            <UserComparisonChart
              userData1={chartdata[0]}
              userData2={chartdata[1]}
            />
          )}
        </VStack>
      </Container>
    </ChakraProvider>
  );
};

export default Compare;
