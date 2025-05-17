import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Spinner,
  Center,
  ChakraProvider,
  Container,
  useMediaQuery,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import axios from "../api/axios";

import GroupsData from "../components/GroupsData";
import Runda from "../components/Runda";
import Wyniki from "../components/Wyniki";

const MotionBox = motion(Box);

const OneOfEight = ({ idzawodow, typ, isLoggedIn }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    groups: [],
    mecze: [],
    meczeRund18: [],
    meczeRund14: [],
    meczeRund12: [],
    meczeRundF: [],
    wyniki: [],
  });

  const [isMobile] = useMediaQuery("(max-width: 48em)");

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const tabBg = useColorModeValue("black.100", "black.800");
  const activeTabBg = useColorModeValue("blue.500", "blue.700");
  const activeTabColor = useColorModeValue("white", "white.200");
  const tabColor = useColorModeValue("gray.600", "gray.400");
  const fetchData = useCallback(async (url, params) => {
    try {
      const response = await axios.get(url, { params, withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      return null;
    }
  }, []);

  const updateData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [groupsData, matchesData, wynikiData] = await Promise.all([
        fetchData(`/groups/groups`, { idzawodow }),
        fetchData(`/match/listRound`, { idzawodow }),
        fetchData(`/results`, { idzawodow }),
      ]);

      setData({
        groups: groupsData ? groupsData[0] || [] : [],
        mecze: groupsData ? groupsData[1] || [] : [],
        meczeRund18: matchesData
          ? matchesData.filter((item) => item.round === "1/8")
          : [],
        meczeRund14: matchesData
          ? matchesData.filter((item) => item.round === "1/4")
          : [],
        meczeRund12: matchesData
          ? matchesData.filter((item) => item.round === "1/2")
          : [],
        meczeRundF: matchesData
          ? matchesData.filter((item) => item.round === "final")
          : [],
        wyniki: wynikiData || [],
      });
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, idzawodow]);

  useEffect(() => {
    console.log("dataaa", data)
    updateData();
  }, [updateData]);

  const tabData = [
    {
     
      label: "Grupy",
      content: (
        <GroupsData
          isLoggedIn={isLoggedIn}
          groups={data.groups}
          mecze={data.mecze}
          idzawodow={idzawodow}
          onRefresh={updateData}
          typ={typ}
          outGrups={data.meczeRundF.length ? data.meczeRundF.length : 0}
        />
      ),
      condition: data.groups.length > 0 || data.mecze.length > 0,
    },
    {
      label: "1/8",
      content: (
        <Runda
          meczeRund={data.meczeRund18}
          idzawodow={idzawodow}
          runda="1/4"
          onRefresh={updateData}
          typ={typ}
          isLoggedIn={isLoggedIn}
        />
      ),
      condition: data.meczeRund18.length > 0,
    },
    {
      label: "1/4",
      content: (
        <Runda
          meczeRund={data.meczeRund14}
          idzawodow={idzawodow}
          runda="1/2"
          onRefresh={updateData}
          typ={typ}
          isLoggedIn={isLoggedIn}
        />
      ),
      condition: data.meczeRund14.length > 0,
    },
    {
      label: "1/2",
      content: (
        <Runda
          meczeRund={data.meczeRund12}
          idzawodow={idzawodow}
          runda="final"
          onRefresh={updateData}
          typ={typ}
          isLoggedIn={isLoggedIn}
        />
      ),
      condition: data.meczeRund12.length > 0,
    },
    {
      label: "Finał",
      content: (
        <Runda
          meczeRund={data.meczeRundF}
          idzawodow={idzawodow}
          runda="wyniki"
          onRefresh={updateData}
          typ={typ}
          isLoggedIn={isLoggedIn}
        />
      ),
      condition: data.meczeRundF.length > 0,
    },
    {
      label: "Wyniki",
      content: (
        <Wyniki
          wyniki={data.wyniki}
          idzawodow={idzawodow}
          isLoggedIn={isLoggedIn}
        />
      ),
      condition: data.wyniki.length > 0,
    },
  ].filter((tab) => tab.condition);

  return (
    <ChakraProvider>
      <Container maxW="1100px" px={4} >
        <Tabs index={tabIndex} onChange={setTabIndex} variant="unstyled" isLazy>
          <TabList
            justifyContent="center"
            p={4}
            bg={tabBg}
            borderBottomWidth={1}
            borderColor={borderColor}
            overflowX={isMobile ? "auto" : "visible"}
            flexWrap={isMobile ? "wrap" : "wrap"}
            sx={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
              "-ms-overflow-style": "none",
              "scrollbar-width": "none",
            }}
          >
            {tabData.map((tab, index) => (
              <Tab
                key={index}
                mx={2}
                my={isMobile ? 1 : 2}
                py={2}
                px={4}
                borderRadius="lg"
                bg={tabIndex === index ? activeTabBg : "transparent"}
                color={tabIndex === index ? activeTabColor : tabColor}
                fontWeight="semibold"
                fontSize={isMobile ? "sm" : "md"}
                transition="all 0.2s"
                _hover={{
                  bg: "blue.200",
                }}
                boxShadow={tabIndex === index ? "md" : "none"}
                flexShrink={0}
                width="80px"
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {tabData.map((tab, index) => (
              <TabPanel key={index} p={0}>
                {tab.content}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Container>
    </ChakraProvider>
  );
};

export default OneOfEight;
