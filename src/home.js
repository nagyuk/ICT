// home.js
import React from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";

const Home = ({ onLogout }) => {
  return (
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
        maxW="600px"
        borderRadius="md"
        boxShadow="md"
        w="full"
      >
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" textAlign="center" color="teal.500">
            Welcome to the Home Page!
          </Heading>
          <Text fontSize="lg" textAlign="center" color="gray.600" mt={4}>
            You have successfully logged in.
          </Text>
          <Button
            colorScheme="teal"
            size="lg"
            mt={6}
            onClick={onLogout} // ログアウトのためのボタン
          >
            Logout
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Home;
