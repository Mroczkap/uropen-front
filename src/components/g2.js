import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Input,
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
  IconButton,
  Tooltip,
  Center
} from "@chakra-ui/react";


import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";
import axios from "../api/axios";
import { toast } from "react-toastify";
import MatchModal from "./modal/MatchModal";

const MotionBox = motion(Box);


const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const GroupsData = ({ groups, mecze, onRefresh, idzawodow, typ, outGrups, isLoggedIn }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [playerFilter, setPlayerFilter] = useState("");
  const [showUnfinished, setShowUnfinished] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

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

  const TabItem = ({ isSelected, children, onClick }) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.600", "gray.300");
    const activeTextColor = useColorModeValue("white", "white");
    const borderColor = useColorModeValue("blue.500", "blue.300");
  
    return (
      <MotionBox
        as="button"
        px={4}
        py={2}
        mx={1}
        borderRadius="md"
        bg={isSelected ? "blue.500" : bgColor}
        color={isSelected ? activeTextColor : textColor}
        fontWeight={isSelected ? "semibold" : "medium"}
        position="relative"
        _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
        onClick={onClick}
        whileHover={{ scale: 1.10 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
        {isSelected && (
          <MotionBox
            position="absolute"
            bottom="-5px"
            left={0}
            right={0}
            height="2px"
            bg={borderColor}
            layoutId="underline"
          />
        )}
      </MotionBox>
    );
  };

  const PlayerTable = ({ players, wins, sets }) => (
    <Box
      borderRadius="lg"
      overflow="hidden"
      bg={useColorModeValue("white", "gray.700")}
    >
      <Table 
        variant="simple" 
        size={isMobile ? "sm" : "md"}
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
      >
        <Thead bg={useColorModeValue("#e0f2ff", "#001433")}>
          <Tr>
            <Th fontSize={isMobile ? "sm" : "lg"} textAlign="center">Rank</Th>
            <Th fontSize={isMobile ? "sm" : "lg"}>Player</Th>
            <Th fontSize={isMobile ? "sm" : "lg"} textAlign="center">Wins</Th>
            <Th fontSize={isMobile ? "sm" : "lg"} textAlign="center">Sets</Th>
          </Tr>
        </Thead>
        <Tbody>
          {players.map((player, index) => (
            <Tr key={index}>
              <Td fontSize={isMobile ? "xs" : "md"} textAlign="center">{index + 1}</Td>
              <Td fontSize={isMobile ? "xs" : "md"}>{player}</Td>
              <Td fontSize={isMobile ? "xs" : "md"} textAlign="center">{wins[index]}</Td>
              <Td fontSize={isMobile ? "xs" : "md"} textAlign="center">{sets[index]}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );

  const MatchTable = ({ matches, onToggleProgress, groupId }) => {
    const completedBgColor = useColorModeValue("green.100", "green.700");
    const inProgressBgColor = useColorModeValue("red.100", "red.700");
    const defaultBgColor = useColorModeValue("white", "gray.800");

    if (isMobile) {
      return (
        <VStack spacing={4} align="stretch">
          {matches.map((match, index) => {
            const bgColor = match.player1sets === 3 || match.player2sets === 3
              ? completedBgColor
              : match.inprogress
              ? inProgressBgColor
              : defaultBgColor;

            return (
              <Box key={index} bg={bgColor} p={2} borderRadius="md">
                <VStack spacing={2} align="stretch">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize="sm" fontWeight="bold">Match {index + 1}</Text>
                    {isLoggedIn && (
                      <Flex alignItems="center">
                       
                        <Switch
                          isChecked={match.inprogress}
                          onChange={() => onToggleProgress(match._id, !match.inprogress)}
                          size="sm"
                        />
                      </Flex>
                    )}
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center" mx="15px">
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs">{match.player1name}</Text>
                      <Text fontSize="xs">{match.player2name}</Text>
                    </VStack>
                    <VStack align="end" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold">{match.player1sets}</Text>
                      <Text fontSize="sm" fontWeight="bold">{match.player2sets}</Text>
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
        <Thead>
          <Tr>
            <Th fontSize="lg" textAlign="center">Match</Th>
            <Th fontSize="lg">Player 1</Th>
            <Th fontSize="lg">Player 2</Th>
            <Th fontSize="lg" textAlign="center">Score</Th>
            <Th fontSize="lg" textAlign="center">Status</Th>
            <Th fontSize="lg" textAlign="center">Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {matches.map((match, index) => {
            const bgColor = match.player1sets === 3 || match.player2sets === 3
              ? completedBgColor
              : match.inprogress
              ? inProgressBgColor
              : defaultBgColor;

            return (
              <Tr key={index} bg={bgColor}>
                <Td fontSize="sm" textAlign="center">{index + 1}</Td>
                <Td fontSize="sm">{match.player1name}</Td>
                <Td fontSize="sm">{match.player2name}</Td>
                <Td fontSize="md" textAlign="center">{match.player1sets} - {match.player2sets}</Td>
                <Td fontSize="md" textAlign="center">
                  {isLoggedIn && (
                    <Flex justifyContent="center" alignItems="center">
                      {/* <Text fontSize="sm" mr={2}></Text> */}
                      <Switch
                        isChecked={match.inprogress}
                        onChange={() => onToggleProgress(match._id, !match.inprogress)}
                        size="md"
                      />
                    </Flex>
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

  return (
    <ChakraProvider>
      <Box 
        maxWidth={isMobile ? "100%" : "1100px"}
        margin="auto" 
        padding={isMobile ? "2" : "4"}
      >
        <Flex justifyContent="center" mb={4}>
          <HStack>
            {isLoggedIn && (
              <Button 
                onClick={(typ !== 1 && typ !== 4) ? handleFinishGroupStage : () => handleFinishGroup(groups[activeTab]._id, groups[activeTab].grupid)} 
                colorScheme="blue" 
                size={isMobile ? "sm" : "lg"}
              >
                {(typ !== 1 && typ !== 4) ? "Finish Group Stage" : "Finish Group"}
              </Button>
            )}
          </HStack>
        </Flex>

        <Tabs index={activeTab} onChange={setActiveTab} variant="soft-rounded" colorScheme="blue" size={isMobile ? "sm" : "lg"}>
          <Flex justifyContent="center" width="100%">
          <Center width="100%">
  <Box 
    width={isMobile ? "100%" : "100%"}
    maxWidth="100%"
    overflowX="auto" 
    pt={2}
    css={{
      '&::-webkit-scrollbar': {
        width: '4px',
        height: '4px',
      },
      '&::-webkit-scrollbar-track': {
        width: '6px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: useColorModeValue('gray.300', 'gray.600'),
        borderRadius: '24px',
      },
    }}
  >
    <Flex 
      as="nav" 
      align="center" 
      justify="center"
      wrap="nowrap"
      pb={2}
      mb={4}
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      {groups.length === 1 ? (
        <TabItem
          isSelected={activeTab === 0}
          onClick={() => setActiveTab(0)}
        >
          <Text fontSize={isMobile ? "sm" : "md"} whiteSpace="nowrap">
            Tryb rozgrywki każdy z każdym
          </Text>
        </TabItem>
      ) : (
        groups.map((grupa, index) => (
          <TabItem
            key={grupa.grupid}
            isSelected={activeTab === index}
            onClick={() => setActiveTab(index)}
          >
            <Text fontSize={isMobile ? "sm" : "md"} whiteSpace="nowrap">
              Group {grupa.grupid}
            </Text>
          </TabItem>
        ))
      )}
    </Flex>
  </Box>
</Center>
          </Flex>
          <TabPanels>
            {groups.map((group, groupIndex) => (
                
              <TabPanel key={groupIndex}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <VStack spacing={4} align="stretch">
                    <Box overflowX="auto" boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)">
                      <PlayerTable
                        players={group.zawodnicy}
                        wins={group.wygrane}
                        sets={group.sety}
                      />
                    </Box>
                    {console.log("gi", groupIndex)}
                    {mecze.filter((m) => m.idgrupy === group._id).length > 10 && (
                      
                      <Flex mb={4} flexDirection={isMobile ? "column" : "row"} alignItems="center">
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
                      
                       <Flex justifyContent="center" width="100%" alignItems="center" marginTop={30} marginBottom={30}>
                       <Text fontSize={isMobile ? "xs" : "lg"} mr={2}>Pokaż tylko nierozegrane mecze</Text>
                       <Switch
                         isChecked={showUnfinished}
                         onChange={(e) => setShowUnfinished(e.target.checked)}
                         size={isMobile ? "sm" : "lg"}
                       />
                     </Flex>

                    <Box overflowX="auto">
                      <MatchTable
                        matches={mecze
                          .filter((m) => m.idgrupy === group._id)
                          .filter(
                            (m) =>
                              m.player1name.toLowerCase().includes(playerFilter.toLowerCase()) ||
                              m.player2name.toLowerCase().includes(playerFilter.toLowerCase())
                          )
                          .filter((m) => !showUnfinished || (m.player1sets !== 3 && m.player2sets !== 3))
                        }
                        onToggleProgress={toggleMatchProgress}
                        groupId={group._id}
                      />
                    </Box>
                  </VStack>
                </MotionBox>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
};

export default GroupsData;
