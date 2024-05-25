import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import reg1 from '../assets/reg1.png'
import reg2 from '../assets/reg2.png'
import reg3 from '../assets/reg3.png'
import reg4 from '../assets/reg4.png'
import reg5 from '../assets/reg5.png'

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
        <img src={reg4} alt="Image 4" />
        <img src={reg5} alt="Image 4" />
      </ImageBox>
    </div>
  );
};

export default Regulamin;
