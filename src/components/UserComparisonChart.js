import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Container,
  useColorModeValue,
  ChakraProvider,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UserComparisonChart = ({ userData1, userData2 }) => {
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  const textColor = useColorModeValue("gray.800", "white");
  const bgColor = useColorModeValue("white", "gray.700");

  const data = [
    { name: "Rozegrane mecze", user1: userData1.match, user2: userData2.match },
    {
      name: "Wygrane mecze",
      user1: userData1.winmatch,
      user2: userData2.winmatch,
    },
  ];

  const data2 = [
    { name: "Rozegrane sety", user1: userData1.sets, user2: userData2.sets },
    {
      name: "Wygrane sety",
      user1: userData1.winsets,
      user2: userData2.winsets,
    },
  ];

  const data3 = [
    {
      name: "% Wygranych meczy",
      user1: userData1.matchpercent * 100,
      user2: userData2.matchpercent * 100,
    },
    {
      name: "% Wygranych setów",
      user1: userData1.setspercent * 100,
      user2: userData2.setspercent * 100,
    },
  ];

  const data4 = [
    {
      name: "Wygrane mecze",
      user1: userData1.pairmatch,
      user2: userData2.pairmatch,
    },
  ];

  const data5 = [
    {
      name: "Wygrane sety",
      user1: userData1.pairsets,
      user2: userData2.pairsets,
    },
  ];

  const data6 = [
    {
      name: "% Wygranych meczy",
      user1: userData1.pairmatchp * 100,
      user2: userData2.pairmatchp * 100,
    },
  ];

  const data7 = [
    {
      name: "% Wygranych setów",
      user1: userData1.pairsetsp * 100,
      user2: userData2.pairsetsp * 100,
    },
  ];

  const Chart = ({ data, name1, name2 }) => (
    <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
      <BarChart data={data} layout={isMobile ? "vertical" : "horizontal"}>
        <CartesianGrid strokeDasharray="3 5" />
        {isMobile ? (
          <YAxis dataKey="name" type="category" width={150} />
        ) : (
          <XAxis dataKey="name" />
        )}
        {isMobile ? <XAxis type="number" /> : <YAxis />}
        <Tooltip />
        <Legend />
        <Bar dataKey="user1" fill="#3182CE" name={name1} />
        <Bar dataKey="user2" fill="#38A169" name={name2} />
      </BarChart>
    </ResponsiveContainer>
  );

  const Chart2 = ({ data, name1, name2 }) => (
    <ResponsiveContainer
      width={isMobile ? "100%" : 400}
      height={isMobile ? 200 : 300}
    >
      <BarChart data={data} layout={isMobile ? "vertical" : "horizontal"}>
        <CartesianGrid strokeDasharray="3 5" />
        {isMobile ? (
          <YAxis dataKey="name" type="category" width={150} />
        ) : (
          <XAxis dataKey="name" />
        )}
        {isMobile ? <XAxis type="number" /> : <YAxis />}
        <Tooltip />
        <Legend />
        <Bar dataKey="user1" fill="#D53F8C" name={name1} />
        <Bar dataKey="user2" fill="#805AD5" name={name2} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <ChakraProvider>
      <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh" py={8}>
        <Container maxW="1100px" px={4}>
          <VStack spacing={8} align="stretch">
            <Heading as="h2" size="xl" textAlign="center" color={textColor}>
              {userData1.name} vs {userData2.name}
            </Heading>

            <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="lg">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  Rozegranych pojedynków: {userData1.pairmatchplayed || 0}
                </Text>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  Rozegranych setów: {userData1.pairsetsplayed || 0}
                </Text>
              </SimpleGrid>
            </Box>

            <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="lg">
              <VStack spacing={8}>
                <Heading as="h3" size="lg" color={textColor}>
                  Bezpośrednie pojedynki
                </Heading>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="100%">
                  <Box>
                    <Chart2
                      data={data4}
                      name1={userData1.name}
                      name2={userData2.name}
                    />
                  </Box>
                  <Box>
                    <Chart2
                      data={data5}
                      name1={userData1.name}
                      name2={userData2.name}
                    />
                  </Box>
                  <Box>
                    <Chart2
                      data={data6}
                      name1={userData1.name}
                      name2={userData2.name}
                    />
                  </Box>
                  <Box>
                    <Chart2
                      data={data7}
                      name1={userData1.name}
                      name2={userData2.name}
                    />
                  </Box>
                </SimpleGrid>
              </VStack>
            </Box>

            <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="lg">
              <VStack spacing={8}>
                <Heading as="h3" size="lg" color={textColor}>
                  Dane ogólne
                </Heading>
                <Chart
                  data={data3}
                  name1={userData1.name}
                  name2={userData2.name}
                />
                <Chart
                  data={data}
                  name1={userData1.name}
                  name2={userData2.name}
                />
                <Chart
                  data={data2}
                  name1={userData1.name}
                  name2={userData2.name}
                />
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default UserComparisonChart;
