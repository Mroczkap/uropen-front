import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Button,
  Input,
  Icon,
  Switch,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import axios from "../api/axios";
import { toast } from "react-toastify";
import MatchModal from "./modal/MatchModal";
import { FaTrophy } from "react-icons/fa";

const MotionBox = motion(Box);

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const GroupsData = ({
  groups,
  mecze,
  onRefresh,
  idzawodow,
  typ,
  isLoggedIn,
  outGrups
}) => {
  console.log("out", outGrups)
  const [activeTab, setActiveTab] = useState(0);
  const [playerFilter, setPlayerFilter] = useState("");
  const [showUnfinished, setShowUnfinished] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("gray.800", "white");
  const bgColor = useColorModeValue("blue.100", "blue.800");

  const isMobile = useIsMobile();

  const handleFinishGroup = (groupId, groupNumber) => {
    let data = [groupId, groupNumber, typ];
    axios
      .post(`groups/finish-group?idzawodow=${idzawodow}`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 203) {
          toast.error("Not all matches have been played");
        } else if (response.status === 200) {
          toast.success("Group successfully completed!");
          onRefresh();
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        toast.error("An error occurred while finishing the group");
      });
  };

  const handleFinishGroupStage = () => {
    let data = [outGrups];
    axios
      .post(`groups/finish-stage?idzawodow=${idzawodow}`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 203) {
          toast.error("Not all matches have been played");
        } else if (response.status === 200) {
          toast.success("Group stage successfully completed!");
          onRefresh();
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        toast.error("An error occurred while finishing the group stage");
      });
  };

  const toggleMatchProgress = (matchId, inProgress) => {
    let data = [matchId, inProgress];
    axios
      .post(`match/progress`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then(() => {
        onRefresh();
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const PlayerTable = ({ players, wins, sets }) => (
    <Table variant="simple" size={isMobile ? "sm" : "md"}>
      <Thead bgColor={bgColor} height={10}>
        <Tr>
          <Th fontSize={isMobile ? "sm" : "lg"} textAlign="center">
            {isMobile ? "R" : "Rank"}
          </Th>
          <Th fontSize={isMobile ? "sm" : "lg"}>Player</Th>
          <Th fontSize={isMobile ? "sm" : "lg"} textAlign="center">
            {isMobile ? "W" : "Wins"}
          </Th>
          <Th fontSize={isMobile ? "sm" : "lg"} textAlign="center">
            {isMobile ? "S" : "Sets"}
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {players.map((player, index) => (
          <Tr key={index}>
            <Td fontSize={isMobile ? "xs" : "md"} textAlign="center">
              {index + 1}
            </Td>
            <Td fontSize={isMobile ? "xs" : "md"}>{player}</Td>
            <Td fontSize={isMobile ? "xs" : "md"} textAlign="center">
              {wins[index]}
            </Td>
            <Td fontSize={isMobile ? "xs" : "md"} textAlign="center">
              {sets[index]}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  const MatchTable = ({ matches, onToggleProgress, groupId }) => {
    const completedBgColor = useColorModeValue("green.100", "green.700");
    const inProgressBgColor = useColorModeValue("red.100", "red.700");
    const defaultBgColor = useColorModeValue("white", "gray.800");
    const isMobile = useIsMobile();

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
                      Match {index + 1}
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
                        player1={match.player1name}
                        player2={match.player2name}
                        player1id={match.player1id}
                        player2id={match.player2id}
                        groupid={groupId}
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
              match.player1sets === 3 || match.player2sets === 3
                ? completedBgColor
                : match.inprogress
                ? inProgressBgColor
                : defaultBgColor;

            return (
              <Tr key={index} bg={bgColor}>
                <Td fontSize="md" textAlign="center">
                  {index + 1}
                </Td>
                <Td fontSize="md">{match.player1name}</Td>
                <Td fontSize="md">{match.player2name}</Td>
                <Td fontSize="md" textAlign="center" fontWeight="bold">
                  {match.player1sets} - {match.player2sets}
                </Td>
                <Td fontSize="md" textAlign="center">
                  {isLoggedIn && (
                    <Switch
                      isChecked={match.inprogress}
                      onChange={() =>
                        onToggleProgress(match._id, !match.inprogress)
                      }
                      size="md"
                    />
                  )}
                </Td>
                <Td fontSize="sm" textAlign="center">
                  {isLoggedIn && (
                    <MatchModal
                      toRank={false}
                      onRefresh={onRefresh}
                      meczid={match._id}
                      player1={match.player1name}
                      player2={match.player2name}
                      player1id={match.player1id}
                      player2id={match.player2id}
                      groupid={groupId}
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

  const renderGroupContent = (group) => {
    const groupMatches = mecze.filter((m) => m.idgrupy === group._id);

    return (
      <MotionBox
        key={group._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={2} align="stretch">
          <Box
            overflowX="auto"
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
            borderRadius="md"
          >
            <PlayerTable
              players={group.zawodnicy}
              wins={group.wygrane}
              sets={group.sety}
            />
          </Box>

          {groupMatches.length > 8 && (
            <Flex
              mt={4}
              flexDirection={isMobile ? "column" : "row"}
              alignItems="center"
            >
              <Input
                placeholder="Filter by player name"
                value={playerFilter}
                onChange={(e) => setPlayerFilter(e.target.value)}
                size={isMobile ? "sm" : "lg"}
                fontSize={isMobile ? "sm" : "md"}
                mb={isMobile ? 2 : 0}
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
              />
            </Flex>
          )}

          <Box
            overflowX="auto"
            marginTop={5}
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
            borderRadius="md"
          >
            <MatchTable
              matches={groupMatches
                .filter(
                  (m) =>
                    m.player1name
                      .toLowerCase()
                      .includes(playerFilter.toLowerCase()) ||
                    m.player2name
                      .toLowerCase()
                      .includes(playerFilter.toLowerCase())
                )
                .filter(
                  (m) =>
                    !showUnfinished ||
                    (m.player1sets !== 3 && m.player2sets !== 3)
                )}
              onToggleProgress={toggleMatchProgress}
              groupId={group._id}
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
              Show only unfinished matches
            </Text>
            <Switch
              isChecked={showUnfinished}
              onChange={(e) => setShowUnfinished(e.target.checked)}
              size={isMobile ? "sm" : "lg"}
            />
          </Flex>
        </VStack>
      </MotionBox>
    );
  };

  return (
    <ChakraProvider>
      <Box
        maxWidth={isMobile ? "100%" : "1100px"}
        margin="auto"
        padding={isMobile ? "2" : "4"}
      >
        <VStack spacing={4} align="stretch">
          {isMobile && isLoggedIn && (
            <Button
              onClick={
                typ !== 1 && typ !== 4
                  ? handleFinishGroupStage
                  : () =>
                      handleFinishGroup(
                        groups[activeTab]._id,
                        groups[activeTab].grupid
                      )
              }
              colorScheme="green"
              size="sm"
              width="100%"
              leftIcon={<Icon as={FaTrophy} />}
            >
              {typ !== 1 && typ !== 4 ? "Finish Group Stage " : "Finish Group"}
            </Button>
          )}

          <Flex
            justifyContent={isMobile ? "center" : "space-between"}
            alignItems="center"
            mb={1}
            flexDirection={isMobile ? "column" : "row"}
          >
            <HStack
              justifyContent={isMobile ? "center" : "left"}
              spacing={2}
              overflowX="auto"
              width="100%"
              paddingBottom={2}
              flexWrap={isMobile ? "wrap" : "nowrap"}
              
            >
              {groups.map((group, index) => (
                <Button
                  key={group._id}
                  onClick={() => setActiveTab(index)}
                  colorScheme={activeTab === index ? "blue" : "gray"}
                  size={isMobile ? "sm" : "md"}
                  mt={2}
                >
                  Group {group.grupid}
                </Button>
              ))}
            </HStack>

            {!isMobile && isLoggedIn && (
              <Button
                onClick={
                  typ !== 1 && typ !== 4
                    ? handleFinishGroupStage
                    : () =>
                        handleFinishGroup(
                          groups[activeTab]._id,
                          groups[activeTab].grupid
                        )
                }
                leftIcon={<Icon as={FaTrophy} />}
                colorScheme="green"
                size="lg"
              >
                {typ !== 1 && typ !== 4 ? "Finish Group Stage" : "Finish Group"}
              </Button>
            )}
          </Flex>

          {groups[activeTab] && renderGroupContent(groups[activeTab])}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default GroupsData;
