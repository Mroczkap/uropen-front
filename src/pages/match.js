import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Grid,
  useColorModeValue,
  Select,
  HStack,
} from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import axios from "../api/axios";
import MatchModal from "../components/modal/MatchModal";

const Match = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meczes, setMeczes] = useState([]);
  const [selectedPlayerName, setSelectedPlayerName] = useState("");

  const handleFilterChange = (e) => {
    setSelectedPlayerName(e.target.value);
  };

  const filteredData = meczes.filter((item) => {
    const player1Match = item?.player1name
      .toLowerCase()
      .includes(selectedPlayerName.toLowerCase());
    const player2Match = item?.player2name
      .toLowerCase()
      .includes(selectedPlayerName.toLowerCase());
    return player1Match || player2Match;
  });

  const handleDateChange = (type, value) => {
    const newDate = new Date(selectedDate);
    if (type === 'year') newDate.setFullYear(value);
    if (type === 'month') newDate.setMonth(value - 1);
    if (type === 'day') newDate.setDate(value);
    setSelectedDate(newDate);
  };

  function getMatches() {
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    const dat = `${year}-${month}-${day}`;

    axios
      .get(`/match/getSingleMatch?date=${dat}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.data;
      })
      .then((data) => {
        
        setMeczes(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

 
  useEffect(() => {
    getMatches();
  }, [selectedDate]);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const finishedMatchBg = useColorModeValue("green.50", "green.900");

  // Generate options for day, month, and year
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={5}>
        <VStack spacing={5} align="stretch">
          <HStack>
            <Select
              value={selectedDate.getDate()}
              onChange={(e) => handleDateChange('day', parseInt(e.target.value))}
            >
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </Select>
            <Select
              value={selectedDate.getMonth() + 1}
              onChange={(e) => handleDateChange('month', parseInt(e.target.value))}
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </Select>
            <Select
              value={selectedDate.getFullYear()}
              onChange={(e) => handleDateChange('year', parseInt(e.target.value))}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          </HStack>

          {meczes.length > 10 && (
            <Input
              placeholder="Nazwisko..."
              value={selectedPlayerName}
              onChange={handleFilterChange}
            />
          )}

          <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
            {filteredData.map((mecz, index) => {
              const isFinished = mecz.player1sets === 3 || mecz.player2sets === 3;

              return (
                <Box
                  key={mecz._id}
                  borderWidth={1}
                  borderRadius="lg"
                  overflow="hidden"
                  bg={isFinished ? finishedMatchBg : bgColor}
                  borderColor={borderColor}
                  boxShadow="md"
                >
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th colSpan={2}>Mecz {index + 1}</Th>
                          <Th></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>{mecz.player1name}</Td>
                          <Td isNumeric>{mecz.player1sets}</Td>
                          <Td rowSpan={2}>
                            <MatchModal
                            toRank={true}
                              onRefresh={getMatches}
                              meczid={mecz._id}
                              player1={mecz.player1name}
                              player2={mecz.player2name}
                              player1id={mecz.player1id}
                              player2id={mecz.player2id}
                              player1sets={mecz.player1sets}
                              player2sets={mecz.player2sets}
                            />
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>{mecz.player2name}</Td>
                          <Td isNumeric>{mecz.player2sets}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              );
            })}
          </Grid>
        </VStack>
      </Container>
    </ChakraProvider>
  );
};

export default Match;
