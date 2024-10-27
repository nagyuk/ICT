import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Alert,
  AlertIcon,
  VStack,
  StackDivider,
  ChakraProvider
} from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { api } from './services/api';
import Home from "./Home";
import Person from './Person';
import Manage from './Manage';
import Log from './Log';

const App = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await api.login(userId, password);
      setUser(userData);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Invalid User ID or Password");
    }
  };

  const renderLogin = () => (
    <Box
      bg="gray.50"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={12}
    >
      <Box
        bg="white"
        p={8}
        maxW="400px"
        borderRadius="md"
        boxShadow="md"
        w="full"
      >
        <VStack spacing={6} align="stretch" divider={<StackDivider borderColor="gray.200" />}>
          <Heading as="h1" size="lg" textAlign="center" color="teal.500">
            Kaimono seisei Application
          </Heading>
          <Text fontSize="md" textAlign="center" color="gray.600">
            Welcome to the Career Success Portal
          </Text>

          <form onSubmit={handleLogin}>
            <VStack spacing={4}>
              <FormControl id="userId" isRequired>
                <FormLabel>User ID</FormLabel>
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your User ID"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your Password"
                />
              </FormControl>

              {errorMessage && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {errorMessage}
                </Alert>
              )}

              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                mt={4}
              >
                Login
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );

  return (
    <ChakraProvider>
      {!user ? (
        renderLogin()
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/person" element={<Person user={user} setUser={setUser} />} />
            <Route path="/manage" element={<Manage user={user} />} />
            <Route path="/log" element={<Log user={user} />} />
          </Routes>
        </Router>
      )}
    </ChakraProvider>
  );
};

export default App;