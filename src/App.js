// App.js
import React, { useState } from "react";
import {Box,Button,FormControl,FormLabel,Input,Heading,Text,Alert,AlertIcon,VStack,StackDivider} from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // react-router-domをインポート
import { register as registerServiceWorker } from './ServiceWorkerRegistration'; // プッシュ通知に関すること
import Home from "./Home";
import Person from './Person';  // 個人情報画面のコンポーネントをインポート
import Manage from './Manage';  // 管理画面のコンポーネントをインポート
import Log from './Log';        // ログイン画面のコンポーネントをインポート

const App = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態を管理

  // サンプルの正しいユーザIDとパスワード
  const validUserId = "jobhunter";
  const validPassword = "career2024";

  const handleLogin = (e) => {
    e.preventDefault();
    if (userId === validUserId && password === validPassword) {
      setErrorMessage(""); // エラーメッセージをクリア
      setIsLoggedIn(true); // ログイン成功時に状態を変更
    } else {
      setErrorMessage("Invalid User ID or Password");
    }
  };

  // ログイン画面
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
                  type="text"
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

  // ログイン後のルーティング
  const renderAppContent = () => (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/person" element={<Person />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/log" element={<Log />} />
      </Routes>
    </Router>
  );

  return (
    <div>
      {isLoggedIn ? renderAppContent() : renderLogin()}
    </div>
  );
};

export default App;
