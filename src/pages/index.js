import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import create from '../assets/create.png'
import zawody from '../assets/zawody.png'
import rankings from '../assets/rankings.png'
import players from '../assets/players.png'
import compare from '../assets/compare.png'
import cykl from '../assets/cykl.jpg'
import { Typography } from '@mui/material';

import { Link } from 'react-router-dom';

const Home = () => {

	


	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
		...theme.typography.body2,
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	  }));


	return (
		<div>
			 <Box sx={{ flexGrow: 1, marginTop: 2,  display: "flex", justifyContent:"center", alignContent: "center" }}>
      <Grid container spacing={2} style={{ width: "90%", maxWidth: 1100, justifyContent: "center" }}>



      <Grid item xs={12} sm={6} md={4}>
          <Item><Link to="/contact">
        <img src={zawody} alt="Zawody" style={{ width: '250px' }}/><br />
		<Typography variant="button" display="block" gutterBottom>	Zawody </Typography></Link></Item>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
		<Item>  <Link to="/blogs">
        <img src={players} alt="Players" style={{ width: '250px' }}/><br />
		<Typography variant="button" display="block" gutterBottom>  Zawodnicy </Typography></Link></Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item>  <Link to="/sign-up">
        <img src={create} alt="Create" style={{ width: '250px' }}/><br />
		<Typography variant="button" display="block" gutterBottom> Nowe Zawody </Typography></Link></Item>
        </Grid>
       
        <Grid item xs={12} sm={6} md={4}>
        <Item>  <Link to="/about">
        <img src={rankings} alt="Rankings" style={{ width: '250px' }}/><br />
		<Typography variant="button" display="block" gutterBottom>   Rankingi </Typography></Link></Item>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
        <Item>  <Link to="/compare">
        <img src={compare} alt="Compare" style={{ width: '250px' }}/><br />
		<Typography variant="button" display="block" gutterBottom>   Prównaj </Typography></Link></Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <Item>  <Link to="/cykl">
        <img src={cykl} alt="Cykl" style={{ width: '250px' }} /><br />
		<Typography variant="button" display="block" gutterBottom>   Cykl </Typography></Link></Item>
        </Grid>
     
     
      </Grid>
    </Box>



		</div>
	);
};

export default Home;
