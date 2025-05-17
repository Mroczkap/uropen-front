import React from 'react';
import { Box, SimpleGrid, Image, Text, VStack, Container, ChakraProvider, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import create from '../assets/create.png';
import zawody from '../assets/zawody.png';
import rankings from '../assets/rankings.png';
import players from '../assets/players.png';
import compare from '../assets/compare.png';
import cykl from '../assets/cykl.jpg';

const MotionBox = motion(Box);

const MenuItem = ({ to, src, alt, text }) => (
  <Link to={to}>
    <VStack
      as="button"
      spacing={3}
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-10px)', boxShadow: 'xl' }}
      bg="white"
      width="100%"
      height="100%"
    >
      <Image src={src} alt={alt}  objectFit="cover" />
      <Text fontWeight="bold" fontSize="lg">
        {text}
      </Text>
    </VStack>
  </Link>
);

const Home = () => {
  const menuItems = [
    { to: "/contact", src: zawody, alt: "Zawody", text: "Zawody" },
    { to: "/blogs", src: players, alt: "Players", text: "Zawodnicy" },
    { to: "/sign-up", src: create, alt: "Create", text: "Nowe Zawody" },
    { to: "/about", src: rankings, alt: "Rankings", text: "Rankingi" },
    { to: "/compare", src: compare, alt: "Compare", text: "Porównaj" },
    { to: "/cykl", src: cykl, alt: "Cykl", text: "Cykl" },
  ];

  return (
    <ChakraProvider>
      <Center>
      <Box minHeight="100vh" py={8} width="1100px" justifyItems="center">
        <Container maxW="container.xl">
          <SimpleGrid 
            columns={{ base: 1, sm: 2, md: 3 }} 
            spacing={10} 
            justifyItems="center"
          >
            {menuItems.map((item, index) => (
              <Center key={index} width="100%">
                <MotionBox
                  width="100%"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <MenuItem {...item} />
                </MotionBox>
              </Center>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
      </Center>
    </ChakraProvider>
  );
};

export default Home;