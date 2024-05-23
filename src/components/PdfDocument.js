import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

const PdfDocument = ({ wyniki }) => (
  <Document>
    <Page style={styles.page}>
      {/* Title */}
      <Text style={styles.title}>Wyniki końcowe</Text>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableHeader, { width: "20%" }]}>
            <Text style={styles.columnHeader}>Miejsce</Text>
          </View>
          <View style={[styles.tableHeader, { width: "40%" }]}>
            <Text style={styles.columnHeader}>Nazwisko</Text>
          </View>
          <View style={[styles.tableHeader, { width: "40%" }]}>
            <Text style={styles.columnHeader}>Imię</Text>
          </View>
        </View>
        {wyniki.map((curUser, index) => (
          <View
            key={curUser._id}
            style={[
              styles.tableRow,
              index % 2 === 0 ? styles.tableRowEven : null,
            ]}
          >
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text style={styles.cell}>{index + 1}</Text>
            </View>
            <View style={[styles.tableCell, { width: "40%" }]}>
              <Text style={styles.cell}>{curUser.nazwisko}</Text>
            </View>
            <View style={[styles.tableCell, { width: "40%" }]}>
              <Text style={styles.cell}>{curUser.imie}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// Styles for the PDF content
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  table: {
    width: "100%",
    display: "table",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
  },
  tableRowEven: {
    backgroundColor: "#f2f2f2", // Background color for even rows
  },
  tableHeader: {
    borderRightWidth: 1,
    borderRightColor: "#bfbfbf",
    padding: 5,
  },
  columnHeader: {
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
  tableCell: {
    padding: 5,
  },
  cell: {
    fontSize: 12,
    fontFamily: "Roboto",
  },
});

export default PdfDocument;
