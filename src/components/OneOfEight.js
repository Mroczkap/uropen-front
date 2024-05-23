import "react-toastify/dist/ReactToastify.css";
import GroupsData from "../components/GroupsData";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Runda from "../components/Runda";
import Wyniki from "../components/Wyniki";
import axios from "../api/axios";
import React from "react";

const OneOfEight = ({ idzawodow, typ, isLoggedIn }) => {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [value, setValue] = useState(0);
  const [groups, setGroups] = useState([]);
  const [mecze, setMecze] = useState([]);
  const [meczeRund18, setMeczeRund18] = useState([]);
  const [meczeRund14, setMeczeRund14] = useState([]);
  const [meczeRund12, setMeczeRund12] = useState([]);
  const [meczeRundF, setMeczeRundF] = useState([]);
  const [wyniki, setWyniki] = useState([]);

  function getGroup() {
    axios
      .get(`/groups?idzawodow=${idzawodow}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.data;
      })
      .then((data) => {
        setGroups(data[0]);
        setMecze(data[1]);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  function getMatches() {
    axios
      .get(`/roundMatch?idzawodow=${idzawodow}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.data;
      })
      .then((data) => {
        const one8 = data.filter((item) => item.round === "1/8");
        const one4 = data.filter((item) => item.round === "1/4");
        const one2 = data.filter((item) => item.round === "1/2");
        const final = data.filter((item) => item.round === "final");

        setMeczeRund18(one8);
        setMeczeRund14(one4);
        setMeczeRund12(one2);
        setMeczeRundF(final);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function getWyniki() {
    axios
      .get(`/wyniki?idzawodow=${idzawodow}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.data;
      })
      .then((data) => {
        setWyniki(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function refresh1() {
    getGroup();
    getMatches();
    if (typ === 4) {
      getWyniki();
    }
  }
  function refresh2() {
    getMatches();
    getWyniki();
  }

  useEffect(() => {
    getGroup();
    getWyniki();
    getMatches();
  }, [idzawodow]);
  const tabLabels = [
    { label: "Grupy", data: groups },
    { label: "1/8", data: meczeRund18 },
    { label: "1/4", data: meczeRund14 },
    { label: "1/2", data: meczeRund12 },
    { label: "finał", data: meczeRundF },
    { label: "Wyniki", data: wyniki },
  ];
  const indexes = [];
  let ind = 0;
  let outGrups = 0;
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            borderBottom: 2,
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="basic tabs example"
          >
            {tabLabels.map((tab, index) => {
              if (tab.data.length > 0) {
                outGrups =
                  outGrups < tab.data.length && tab.label !== "Wyniki"
                    ? tab.data.length
                    : outGrups;
                indexes.push(ind);
                ind++;
                return (
                  <Tab key={index} label={tab.label} {...a11yProps(index)} />
                );
              }
              indexes.push(-1);
              return null;
            })}
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={indexes[0]}>
          <GroupsData
            isLoggedIn={isLoggedIn}
            groups={groups}
            mecze={mecze}
            idzawodow={idzawodow}
            onRefresh={refresh1}
            typ={typ}
            outGrups={outGrups}
          />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={indexes[1]}>
          <Runda
            meczeRund={meczeRund18}
            idzawodow={idzawodow}
            runda="1/4"
            onRefresh={getMatches}
            key={0}
            typ={typ}
            isLoggedIn={isLoggedIn}
          />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={indexes[2]}>
          <Runda
            meczeRund={meczeRund14}
            idzawodow={idzawodow}
            runda="1/2"
            onRefresh={getMatches}
            key={1}
            typ={typ}
            isLoggedIn={isLoggedIn}
          />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={indexes[3]}>
          <Runda
            meczeRund={meczeRund12}
            idzawodow={idzawodow}
            runda="final"
            onRefresh={getMatches}
            key={2}
            typ={typ}
            isLoggedIn={isLoggedIn}
          />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={indexes[4]}>
          <Runda
            meczeRund={meczeRundF}
            idzawodow={idzawodow}
            runda="wyniki"
            key={3}
            onRefresh={refresh2}
            typ={typ}
            isLoggedIn={isLoggedIn}
          />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={indexes[5]}>
          <Wyniki
            wyniki={wyniki}
            idzawodow={idzawodow}
            isLoggedIn={isLoggedIn}
          />
        </CustomTabPanel>
      </Box>
    </>
  );
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default OneOfEight;
