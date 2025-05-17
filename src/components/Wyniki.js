import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  VStack,
  Button,
  useColorModeValue,
  ChakraProvider
} from "@chakra-ui/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { motion } from "framer-motion";
import PdfDocument from "./PdfDocument";
import AddToRankingModal from "./addToRankingModal/AddToRankingModal";
import AddToCyklModal from "./addToCyklModal/AddToCyklModal";
const MotionBox = motion(Box);

const Wyniki = ({ wyniki, idzawodow, isLoggedIn }) => {
  const bg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("blue.500", "blue.200");
  const headerColor = useColorModeValue("white", "gray.800");
  const rowBg = useColorModeValue("gray.50", "gray.700");

  return (
    <ChakraProvider>
      <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
    <VStack spacing={8} align="stretch" w="full" maxW="container.lg" mx="auto" p={4}>
      <Heading as="h1" textAlign="center">
        Wyniki końcowe
      </Heading>

      <TableContainer bg={bg} borderRadius="lg" boxShadow="lg">
        <Table variant="simple" >
          <Thead height="50px">
            <Tr bg={headerBg} >
              <Th fontSize="md" color={headerColor}>L.p.</Th>
              <Th fontSize="md" color={headerColor}>Nazwisko</Th>
              <Th fontSize="md" color={headerColor}>Imię</Th>
            </Tr>
          </Thead>
          <Tbody>
            {wyniki.map((curUser, index) => {
              const { _id, nazwisko, imie } = curUser;
              return (
                <Tr key={_id} bg={index % 2 === 0 ? bg : rowBg}>
                  <Td>{index + 1}</Td>
                  <Td>{nazwisko}</Td>
                  <Td>{imie}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <Box>
        <PDFDownloadLink
          document={<PdfDocument wyniki={wyniki} />}
          fileName="wyniki.pdf"
        >
          {({ loading }) => (
            <Button colorScheme="blue" isLoading={loading}>
              Pobierz wyniki w formacie PDF
            </Button>
          )}
        </PDFDownloadLink>
      </Box>

      {isLoggedIn && (
        <VStack spacing={4}>
          <AddToRankingModal idzawodow={idzawodow} />
          <AddToCyklModal idzawodow={idzawodow} />
        </VStack>
      )}
    </VStack>
    </MotionBox>
    </ChakraProvider>
  );
};

export default Wyniki;