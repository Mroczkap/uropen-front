import React from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  ChakraProvider,
  extendTheme,
  Text
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import useAuth from "../../hooks/useAuth";
import logour from "../../assets/uropen2.jpg";
const theme = extendTheme({
  fonts: {
    heading: "'Arial', sans-serif",
    body: "'Roboto', sans-serif",
  },
  colors: {
    brand: {
      500: "#415160", // Dark blue-gray
      600: "#FFFFFF", 
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
      },
    },
  },
});

const NavLink = ({ children, to, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Box
      as={RouterLink}
      to={to}
      px={3}
      py={2}
      rounded={"md"}
      bg={isActive ? "brand.600" : "transparent"}
      color={isActive ? "brand.500" : "white"}
      fontWeight="bold"
      fontSize="18px"
      fontStyle="initial"
      _hover={{
        textDecoration: "none",
        bg: "brand.600",
        color: "blue.500",
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const logout = useLogout();
  const { auth } = useAuth();

  const isLoggedIn = auth?.roles?.find((role) => "5150"?.includes(role))
    ? true
    : false;

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  const signIn = async () => {
    navigate("/login");
  };

  const Links = [
    { name: "Zawody", to: "/contact" },
    { name: "Zawodnicy", to: "/blogs" },
    { name: "Nowe zawody", to: "/sign-up" },
    { name: "Mecze", to: "/match" },
    { name: "Rankingi", to: "/about" },
    { name: "Porównaj", to: "/compare" },
    { name: "Cykl", to: "/cykl" },
    { name: "Regulamin", to: "/regulamin" },
  ];

  const handleLinkClick = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box bg="brand.500" px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
           <img
  src={logour}
  alt="Logo"
  className="logo-image"
  style={{ height: "50px", width: "auto" }}
/>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            color="black"
          />
          <HStack spacing={8} alignItems={"center"} flex={1} justifyContent="center">
            <HStack as={"nav"} spacing={8} display={{ base: "none", md: "flex" }}>
              {Links.map((link) => (
                <NavLink key={link.name} to={link.to}>{link.name}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Button
              onClick={isLoggedIn ? signOut : signIn}
              colorScheme="whiteAlpha"
              variant="outline"
              fontWeight="bold"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
            >
              {isLoggedIn ? "Wyloguj" : "Zaloguj"}
            </Button>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={5}>
              {Links.map((link) => (
                <NavLink key={link.name} to={link.to} onClick={handleLinkClick}>{link.name}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </ChakraProvider>
  );
}