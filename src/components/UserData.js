import React, { useState } from "react";
import {
  Box,
  Input,
  VStack,
  HStack,
  Text,
  Container,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  ChakraProvider,
} from "@chakra-ui/react";
import { SearchIcon, AddIcon, EditIcon, DeleteIcon, ViewOffIcon } from "@chakra-ui/icons";
import AddModal from "../components/addModal/AddModal";
import RemoveModal from "./removeModal/RemoveModal";

const UserTableRow = ({ user, onRefresh, visibleColumns, index }) => {
  const { _id, ranking, nazwisko, imie, plec, wiek, okladziny } = user;

  return (
    <Tr _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}>
      <Td textAlign="center">{index}</Td>
      <Td fontWeight="medium">{nazwisko} {imie}</Td>
      {visibleColumns.ranking && <Td textAlign="center"><Badge colorScheme={ranking >= 500 ? "green" : "orange"}>{ranking}</Badge></Td>}
      {visibleColumns.plec && <Td textAlign="center">{plec}</Td>}
      {visibleColumns.wiek && <Td textAlign="center">{wiek}</Td>}
      {visibleColumns.okladziny && <Td textAlign="center">{okladziny}</Td>}
      <Td textAlign="center">
        <HStack spacing={2} justifyContent="center">
          <AddModal edit={true} user={user} onRefresh={onRefresh}>
            <IconButton
              icon={<EditIcon />}
              size="sm"
              variant="ghost"
              aria-label="Edit"
            />
          </AddModal>
          <RemoveModal
            onRefresh={onRefresh}
            id={_id}
            imie={imie}
            nazwisko={nazwisko}
          >
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              aria-label="Delete"
              
              
              
            />
          </RemoveModal>
        </HStack>
      </Td>
    </Tr>
  );
};

const UserData = ({ users, onRefresh }) => {
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("ranking");
const [sortDirection, setSortDirection] = useState("desc");;
  const [visibleColumns, setVisibleColumns] = useState({
    ranking: true,
    plec: true,
    wiek: false,
    okladziny: false,
  });


  const filteredData = users.filter((item) =>
    item.nazwisko.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortField === "ranking") {
      return sortDirection === "desc" ? b[sortField] - a[sortField] : a[sortField] - b[sortField];
    } else {
      if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }
  });

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const tableBgColor = useColorModeValue("white", "gray.800");

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleColumn = (column) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  return (
    <ChakraProvider>
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="1100px">
          <VStack spacing={8} align="stretch">
            <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={4}>
              <InputGroup maxW="400px">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Szukaj po nazwisku..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  bg={useColorModeValue("white", "gray.800")}
                />
              </InputGroup>
              <HStack>
                <Menu closeOnSelect={false}>
                  <MenuButton as={Button} rightIcon={<ViewOffIcon />}>
                    Kolumny
                  </MenuButton>
                  <MenuList minWidth="240px">
                    <MenuItem onClick={() => toggleColumn('ranking')}>
                      <Checkbox isChecked={visibleColumns.ranking} mr={2} />
                      Ranking
                    </MenuItem>
                    <MenuItem onClick={() => toggleColumn('plec')}>
                      <Checkbox isChecked={visibleColumns.plec} mr={2} />
                      Płeć
                    </MenuItem>
                    <MenuItem onClick={() => toggleColumn('wiek')}>
                      <Checkbox isChecked={visibleColumns.wiek} mr={2} />
                      Wiek
                    </MenuItem>
                    <MenuItem onClick={() => toggleColumn('okladziny')}>
                      <Checkbox isChecked={visibleColumns.okladziny} mr={2} />
                      Okładziny
                    </MenuItem>
                  </MenuList>
                </Menu>
                <AddModal onRefresh={onRefresh}>
                  <Button leftIcon={<AddIcon />} colorScheme="blue">
                    Dodaj zawodnika
                  </Button>
                </AddModal>
              </HStack>
            </Flex>

            <Box overflowX="auto">
              <Table variant="simple" bg={tableBgColor} borderRadius="md" boxShadow="sm" maxWidth="1100px" margin="0 auto">
                <Thead>
                  <Tr>
                    <Th textAlign="center">Lp.</Th>
                    <Th cursor="pointer" onClick={() => handleSort("nazwisko")}>
                      Zawodnik {sortField === "nazwisko" && (sortDirection === "asc" ? "↑" : "↓")}
                    </Th>
                    {visibleColumns.ranking && (
                      <Th textAlign="center" cursor="pointer" onClick={() => handleSort("ranking")}>
                        Ranking {sortField === "ranking" && (sortDirection === "asc" ? "↑" : "↓")}
                      </Th>
                    )}
                    {visibleColumns.plec && (
                      <Th textAlign="center" cursor="pointer" onClick={() => handleSort("plec")}>
                        Płeć {sortField === "plec" && (sortDirection === "asc" ? "↑" : "↓")}
                      </Th>
                    )}
                    {visibleColumns.wiek && (
                      <Th textAlign="center" cursor="pointer" onClick={() => handleSort("wiek")}>
                        Wiek {sortField === "wiek" && (sortDirection === "asc" ? "↑" : "↓")}
                      </Th>
                    )}
                    {visibleColumns.okladziny && (
                      <Th textAlign="center" cursor="pointer" onClick={() => handleSort("okladziny")}>
                        Okładziny {sortField === "okladziny" && (sortDirection === "asc" ? "↑" : "↓")}
                      </Th>
                    )}
                    <Th textAlign="center">Akcje</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedData.map((user, index) => (
                    <UserTableRow 
                      key={user._id} 
                      user={user} 
                      onRefresh={onRefresh} 
                      visibleColumns={visibleColumns} 
                      index={index + 1}
                    />
                  ))}
                </Tbody>
              </Table>
            </Box>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default UserData;