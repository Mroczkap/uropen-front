import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Flex,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "@chakra-ui/icons";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import axios from "../api/axios";

const Rankings = ({ idrankingu }) => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const getRankings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/rankings?idrankingu=${idrankingu}`, {
          withCredentials: true,
        });
        const data = response.data.map((row, index) => ({
          ...row,
          itemNumber: index + 1,
        }));
        setRankings(data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    getRankings();
  }, [idrankingu]);

  const columns = React.useMemo(
    () => [
      { 
        Header: "Rank", 
        accessor: "itemNumber", 
        width: 50,
        Cell: ({ value }) => <Text textAlign="center">{value}</Text>
      },
      { 
        Header: "Player", 
        accessor: "name", 
        width: 200,
        Cell: ({ value, row }) => (
          <Text cursor="pointer" onClick={() => {
            setSelectedPlayer(row.original);
            onOpen();
          }}>
            {value}
          </Text>
        )
      },
      {
        Header: "Win %",
        accessor: "matchpercent",
        sortType: (a, b) => a.original.matchpercent - b.original.matchpercent,
        Cell: ({ value }) => (
          <Badge colorScheme={value > 0.5 ? "green" : "red"} variant="solid">
            {(value * 100).toFixed(1)}%
          </Badge>
        ),
      },
      { 
        Header: "Matches", 
        accessor: "match",
        Cell: ({ value }) => <Text textAlign="center">{value}</Text>
      },
      { 
        Header: "Wins", 
        accessor: "winmatch",
        Cell: ({ value }) => <Text textAlign="center">{value}</Text>
      },
      {
        Header: "Set Win %",
        accessor: "setspercent",
        sortType: (a, b) => a.original.setspercent - b.original.setspercent,
        Cell: ({ value }) => (
          <Badge colorScheme={value > 0.5 ? "blue" : "orange"} variant="solid">
            {(value * 100).toFixed(1)}%
          </Badge>
        ),
      },
      { 
        Header: "Sets", 
        accessor: "sets",
        Cell: ({ value }) => <Text textAlign="center">{value}</Text>
      },
      { 
        Header: "Set Wins", 
        accessor: "winsets",
        Cell: ({ value }) => <Text textAlign="center">{value}</Text>
      },
      { 
        Header: "Tournaments", 
        accessor: "tournaments",
        Cell: ({ value }) => <Text textAlign="center">{value}</Text>
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: rankings,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  return (
    <ChakraProvider>
      <VStack spacing={8} align="center" p={4} width="100%">
        <Box width={["100%", "100%", "80%", "60%"]}>
          <Flex justifyContent="space-between" alignItems="center" mb={4} flexDirection={["column", "row"]}>
            {/* <Text fontSize="3xl" fontWeight="bold" letterSpacing="tight" mb={[4, 0]}>
              Rankings
            </Text> */}
            <InputGroup maxWidth={["100%", "300px"]}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search players..."
                onChange={(e) => setFilter("name", e.target.value)}
              />
            </InputGroup>
          </Flex>
          <Box
            borderWidth={1}
            borderRadius="lg"
            overflow="hidden"
            bg={bg}
            borderColor={borderColor}
            boxShadow="lg"
            overflowX="auto"
          >
            <Table {...getTableProps()} size="sm">
              <Thead>
                {headerGroups.map((headerGroup) => (
                  <Tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <Th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        p={4}
                        textTransform="uppercase"
                        letterSpacing="wider"
                        fontWeight="medium"
                        fontSize="xs"
                        color="gray.500"
                        textAlign={column.id === 'name' ? "left" : "center"}
                      >
                        <HStack spacing={1} justifyContent={column.id === 'name' ? "flex-start" : "center"}>
                          <Text>{column.render("Header")}</Text>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FaSortDown aria-label="sorted descending" />
                            ) : (
                              <FaSortUp aria-label="sorted ascending" />
                            )
                          ) : null}
                        </HStack>
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody {...getTableBodyProps()}>
                <AnimatePresence>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <motion.tr
                        key={row.id}
                        {...row.getRowProps()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        _hover={{ bg: hoverBg }}
                      >
                        {row.cells.map((cell) => (
                          <Td 
                            {...cell.getCellProps()} 
                            p={4} 
                            borderBottom="1px" 
                            borderColor={borderColor}
                            textAlign={cell.column.id === 'name' ? "left" : "center"}
                          >
                            {cell.render("Cell")}
                          </Td>
                        ))}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </Tbody>
            </Table>
          </Box>
          <Flex justifyContent="space-between" alignItems="center" mt={4} flexDirection={["column", "row"]}>
            <HStack spacing={2} mb={[4, 0]}>
              <IconButton
                onClick={() => previousPage()}
                isDisabled={!canPreviousPage}
                icon={<ChevronLeftIcon />}
                aria-label="Previous Page"
              />
              <IconButton
                onClick={() => nextPage()}
                isDisabled={!canNextPage}
                icon={<ChevronRightIcon />}
                aria-label="Next Page"
              />
            </HStack>
            <Text fontSize="sm" mb={[4, 0]}>
              Page{" "}
              <Text as="span" fontWeight="bold">
                {pageIndex + 1}
              </Text>{" "}
              of{" "}
              <Text as="span" fontWeight="bold">
                {pageOptions.length}
              </Text>
            </Text>
            <Select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              width="auto"
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </Select>
          </Flex>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedPlayer?.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="start" spacing={4}>
                <Text>Rank: {selectedPlayer?.itemNumber}</Text>
                <Text>Win %: {(selectedPlayer?.matchpercent * 100).toFixed(1)}%</Text>
                <Text>Matches Played: {selectedPlayer?.match}</Text>
                <Text>Matches Won: {selectedPlayer?.winmatch}</Text>
                <Text>Set Win %: {(selectedPlayer?.setspercent * 100).toFixed(1)}%</Text>
                <Text>Sets Played: {selectedPlayer?.sets}</Text>
                <Text>Set Wins: {selectedPlayer?.winsets}</Text>
                <Text>Tournaments Played: {selectedPlayer?.tournaments}</Text>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </ChakraProvider>
  );
};

export default Rankings;