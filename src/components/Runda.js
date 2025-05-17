import React from "react";
import PropTypes from "prop-types";
import Mecze from "./Mecze";
import "react-toastify/dist/ReactToastify.css";

const Runda = ({ meczeRund, onRefresh, runda, idzawodow, typ, isLoggedIn }) => {
  return (
    <Mecze
      array={meczeRund}
      isLoggedIn={isLoggedIn}
      onRefresh={onRefresh}
      runda={runda}
      idzawodow={idzawodow}
    />
  );
};

Runda.propTypes = {
  meczeRund: PropTypes.array.isRequired,
  onRefresh: PropTypes.func.isRequired,
  runda: PropTypes.string.isRequired,
  idzawodow: PropTypes.string.isRequired,
  typ: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Runda;
