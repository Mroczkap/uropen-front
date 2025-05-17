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
  Badge
} from "@chakra-ui/react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "@chakra-ui/icons";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import axios from "../api/axios";

const Cykle = ({ idrankingu, count }) => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRankings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/cycles/ranking?idrankingu=${idrankingu}`, {
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
        Header: "Miejsce",
        accessor: "itemNumber",
        width: 90,
        Cell: ({ value }) => <Text textAlign="center">{value}</Text>,
      },
      {
        Header: "Zawodnik",
        accessor: "name",
        width: 200,
        Cell: ({ value }) => <Text textAlign="left">{value}</Text>,
      },
      {
        Header: "Suma Punktów",
        accessor: "sumapkt",
        width: 155,
        sortType: (a, b) => a.original.sumapkt - b.original.sumapkt,
        Cell: ({ value }) => (
         
          <Badge colorScheme="red" variant="solid" fontSize="sm" >
            {value}
          </Badge>
        ),
      },
      ...Array.from({ length: count }, (_, index) => ({
        Header: `Zawody ${index + 1}`,
        accessor: `z${index + 1}`,
        width: 120,
        Cell: ({ value }) => <Text textAlign="center">{value}</Text>,
      })),
    ],
    [count]
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
        <Box width={["100%", "100%", "90%", "90%"]} maxWidth="1100px">
          <Flex justifyContent="space-between" alignItems="center" mb={4} flexDirection={["column", "row"]}>
            {/* <Text fontSize="3xl" fontWeight="bold" letterSpacing="tight" mb={[4, 0]}>
              Cykle
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
              {[10, 20,30,40,50, 100].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </Select>
          </Flex>
        </Box>
      </VStack>
    </ChakraProvider>
  );
};

export default Cykle