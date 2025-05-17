import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  Table,
  Tbody,
  Tr,
  Td,
  Switch,
  useColorModeValue,
  useColorMode,
  Text,
  Flex,
  Input,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import axios from "../api/axios";
import { toast } from "react-toastify";
import MatchModal from "./modal/MatchModal";

const MotionBox = motion(Box);

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const autoSaveWolnyLos = (match, onRefresh, runda, idzawodow) => {
  const data = [
    match._id,
    3, // counterSet1
    0, // counterSet2
    null, // groupid (assuming it's not needed for this case)
    runda,
    match.player1id,
    match.player2id,
    idzawodow,
    match.idmeczu,
  ];

  axios
    .post(`match/freeMatch`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => {
      onRefresh();
      return response.data;
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
};

const Mecze = ({ array, isLoggedIn, onRefresh, runda, idzawodow }) => {
  const { colorMode } = useColorMode();
  const isMobile = useIsMobile();
  const [playerFilter, setPlayerFilter] = useState("");
  const [showUnfinished, setShowUnfinished] = useState(false);
  const bgColor = useColorModeValue("blue.100", "blue.800");

  const toggleMatchProgress = (matchId, inProgress) => {
    let data = [matchId, inProgress];
    axios
      .post(`match/progress`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then(() => {
        onRefresh();
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        toast.error("Failed to update match progress");
      });
  };

  const przedzialMeczu = (idmeczu, runda) => {
    let nazwa;
    switch (runda) {
      case "1/4":
        nazwa = `Mecz ${idmeczu}`;
        break;
      case "1/2":
        const array = ["error", "1-8", "9-16", "17-24", "25-32"];
        const index = parseInt(idmeczu / 4 + 0.75);
        nazwa = `Mecz w przedziale miejsc: ${array[index]}`;
        break;
      case "final":
        const array2 = [
          "error",
          "1-4",
          "5-8",
          "9-12",
          "13-16",
          "17-20",
          "21-24",
          "25-28",
          "29-32",
        ];
        const index2 = parseInt(idmeczu / 2 + 0.5);
        nazwa = `Mecz w przedziale miejsc: ${array2[index2]}`;
        break;
      case "wyniki":
        nazwa = `Mecz o miejsce ${2 * idmeczu - 1}`;
        break;
      default:
        console.log(`Sorry, we are out of ${runda}.`);
    }
    return nazwa;
  };

  const MatchTable = ({ matches, onToggleProgress, runda, idzawodow, onRefresh }) => {
    const completedBgColor = useColorModeValue("green.100", "green.700");
    const inProgressBgColor = useColorModeValue("red.100", "red.700");
    const defaultBgColor = useColorModeValue("white", "gray.800");

    useEffect(() => {
      matches.forEach((match) => {
        if (
          match.player1name === "Wolny Los" &&
          match.player2name === "Wolny Los" &&
          !match.saved
        ) {
          autoSaveWolnyLos(match, onRefresh, runda, idzawodow);
        }
      });
    }, [matches, runda, idzawodow, onRefresh]);

    if (isMobile) {
      return (
        <VStack spacing={4} align="stretch">
          {matches.map((match, index) => {
            const bgColor =
              match.player1sets === 3 || match.player2sets === 3
                ? completedBgColor
                : match.inprogress
                ? inProgressBgColor
                : defaultBgColor;

            return (
              <Box key={index} bg={bgColor} p={2} borderRadius="md">
                <VStack spacing={2} align="stretch">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize="sm" fontWeight="bold">
                      {przedzialMeczu(match.idmeczu, runda)}
                    </Text>
                    {isLoggedIn && (
                      <Flex alignItems="center">
                        <Switch
                          isChecked={match.inprogress}
                          onChange={() =>
                            onToggleProgress(match._id, !match.inprogress)
                          }
                          size="sm"
                        />
                      </Flex>
                    )}
                  </Flex>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mx="15px"
                  >
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs">{match.player1name}</Text>
                      <Text fontSize="xs">{match.player2name}</Text>
                    </VStack>
                    <VStack align="end" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold">
                        {match.player1sets}
                      </Text>
                      <Text fontSize="sm" fontWeight="bold">
                        {match.player2sets}
                      </Text>
                    </VStack>
                  </Flex>
                  {isLoggedIn && (
                    <Box alignSelf="center">
                      <MatchModal
                      toRank={false}
                        onRefresh={onRefresh}
                        meczid={match._id}
                        runda={runda}
                        idzawodow={idzawodow}
                        idmeczu={match.idmeczu}
                        player1={match.player1name}
                        player2={match.player2name}
                        player1id={match.player1id}
                        player2id={match.player2id}
                        player1sets={match.player1sets}
                        player2sets={match.player2sets}
                      />
                    </Box>
                  )}
                </VStack>
              </Box>
            );
          })}
        </VStack>
      );
    }

    return (
      <Table variant="simple" size={isLoggedIn ? "sm" : "md"}>
        <Tbody>
          {matches.map((match, index) => {
            const bgColor =
              match.player1sets === 3 ||
              match.player2sets === 3 ||
              match.saved === true
                ? completedBgColor
                : match.inprogress
                ? inProgressBgColor
                : defaultBgColor;

            return (
              <Tr key={index} bg={bgColor}>
                <Td fontSize="md" textAlign="center">
                  {przedzialMeczu(match.idmeczu, runda)}
                </Td>
                <Td fontSize="md">{match.player1name}</Td>
                <Td fontSize="md">{match.player2name}</Td>
                <Td fontSize="md" fontWeight="bold" textAlign="center">
                  {match.player1sets} - {match.player2sets}
                </Td>
                <Td fontSize="md" textAlign="center">
                  {isLoggedIn && (
                    <Flex justifyContent="center" alignItems="center">
                      <Switch
                        isChecked={match.inprogress}
                        onChange={() =>
                          onToggleProgress(match._id, !match.inprogress)
                        }
                        size="md"
                      />
                    </Flex>
                  )}
                </Td>
                <Td fontSize="md" textAlign="center">
                  {isLoggedIn && (
                    <MatchModal
                    toRank={false}
                      onRefresh={onRefresh}
                      meczid={match._id}
                      runda={runda}
                      idzawodow={idzawodow}
                      idmeczu={match.idmeczu}
                      player1={match.player1name}
                      player2={match.player2name}
                      player1id={match.player1id}
                      player2id={match.player2id}
                      player1sets={match.player1sets}
                      player2sets={match.player2sets}
                    />
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    );
  };

  return (
    <ChakraProvider>
      <Box
        maxWidth={isMobile ? "100%" : "1100px"}
        margin="auto"
        padding={isMobile ? "2" : "4"}
      >
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {array.length > 3 && (
            <Flex
              mb={4}
              flexDirection={isMobile ? "column" : "row"}
              alignItems="center"
            >
              <Input
                placeholder="Filter by player name"
                value={playerFilter}
                onChange={(e) => setPlayerFilter(e.target.value)}
                mr={2}
                size={isMobile ? "sm" : "lg"}
                fontSize={isMobile ? "sm" : "md"}
                mb={isMobile ? 2 : 0}
              />
            </Flex>
          )}

          <Box
            overflowX="auto"
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
          >
            <MatchTable
              matches={array
                .filter((m) => {
                  if (!playerFilter) 
                    return !(m.player1name === "Wolny Los" && m.player2name === "Wolny Los");
                  const filterLower = playerFilter.toLowerCase();
                  const player1Match = m.player1name
                    ?.toLowerCase()
                    .includes(filterLower);
                  const player2Match = m.player2name
                    ?.toLowerCase()
                    .includes(filterLower);
                  return (
                    player1Match ||
                    player2Match ||
                    (m.player1name == null && m.player2name == null)
                  );
                })
                .filter(
                  (m) =>
                    !showUnfinished ||
                    (m.player1sets !== 3 && m.player2sets !== 3 && !m.saved)
                )}
              onToggleProgress={toggleMatchProgress}
              onRefresh={onRefresh}
              runda={runda}
              idzawodow={idzawodow}
            />
          </Box>
          <Flex
            justifyContent="center"
            width="100%"
            alignItems="center"
            marginTop={30}
            marginBottom={30}
          >
            <Text fontSize={isMobile ? "xs" : "lg"} mr={2}>
              Pokaż tylko nierozegrane mecze
            </Text>
            <Switch
              isChecked={showUnfinished}
              onChange={(e) => setShowUnfinished(e.target.checked)}
              size={isMobile ? "sm" : "lg"}
            />
          </Flex>
        </MotionBox>
      </Box>
    </ChakraProvider>
  );
};

export default Mecze;