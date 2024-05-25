import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import reg1 from '../assets/reg1.jpg'
import reg2 from '../assets/reg2.jpg'
import reg3 from '../assets/reg3.jpg'

const ImageBox = styled(Box)(({ theme }) => ({
  maxWidth: 1100,
  width: '100%',
  margin: 'auto',
  '& img': {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

const Regulamin = () => {
  return (
    <div className="container">
      <ImageBox>
        <img src={reg1} alt="Image 1" />
        <img src={reg2} alt="Image 2" />
        <img src={reg3} alt="Image 3" />
      </ImageBox>
    </div>
  );
};

export default Regulamin;
