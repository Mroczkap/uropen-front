import "react-toastify/dist/ReactToastify.css";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Button from "@mui/material/Button";
import PdfDocument from "./PdfDocument";
import AddToRankingModal from "./addToRankingModal/AddToRankingModal";
import AddToCyklModal from "./addToCyklModal/AddToCyklModal";


const Wyniki = ({ wyniki, idzawodow, isLoggedIn }) => {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#7398fa",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  let lp = 0;

 
  return (
    <>
      <h1>
        <center> Wyniki końcowe</center>
      </h1>

      <div className="container">
        <TableContainer component={Paper} sx={{ maxWidth: 800, boxShadow: 11 }}>
          <Table sx={{ minWidth: 200 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell>L.p.</StyledTableCell>
                <StyledTableCell align="left">Nazwisko</StyledTableCell>
                <StyledTableCell align="left">Imię</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wyniki.map((curUser) => {
                const { _id, nazwisko, imie } = curUser;
                lp++;
                return (
                  <StyledTableRow
                    key={_id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <StyledTableCell component="th" scope="row">
                      {lp}
                    </StyledTableCell>
                    <StyledTableCell align="left">{nazwisko}</StyledTableCell>
                    <StyledTableCell align="left">{imie}</StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="container">
        {/* PDFDownloadLink */}
        <PDFDownloadLink
          document={<PdfDocument wyniki={wyniki} />}
          fileName="wyniki.pdf"
        >
          {({ blob, url, loading, error }) =>
            loading ? (
              "Loading document..."
            ) : (
              <Button variant="outlined">Pobierz wyniki w formacie PDF</Button>
            )
          }
        </PDFDownloadLink>
      </div>
      <div className="container">
      {  isLoggedIn ? 
        <AddToRankingModal idzawodow={idzawodow}/> : null }
      </div>

       <div className="container">
      {  isLoggedIn ? 
        <AddToCyklModal idzawodow={idzawodow}/> : null }
      </div>
    </>
  );
};
export default Wyniki;
