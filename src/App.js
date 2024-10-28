// App.js
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
  ChakraProvider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // サインアップフォームの状態
  const [signupForm, setSignupForm] = useState({
    userId: "",
    name: "",
    password: "",
    confirmPassword: "",
    familyNum: 1
  });

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

  const handleLogout = () => {
    setUser(null);
    setUserId("");
    setPassword("");
  };

  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({
      ...prev,
      [name]: name === 'familyNum' ? parseInt(value) || 1 : value
    }));
  };

  const validateSignupForm = () => {
    if (!signupForm.userId || !signupForm.name || !signupForm.password || !signupForm.confirmPassword) {
      toast({
        title: '必須項目を入力してください',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (signupForm.password.length < 8) {
      toast({
        title: 'パスワードは8文字以上必要です',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: 'パスワードが一致しません',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateSignupForm()) return;

    try {
      const newUser = await api.signup({
        userId: signupForm.userId,
        name: signupForm.name,
        password: signupForm.password,
        familyNum: signupForm.familyNum
      });

      toast({
        title: 'アカウント作成成功',
        description: 'ログインしてください',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // フォームをリセット
      setSignupForm({
        userId: "",
        name: "",
        password: "",
        confirmPassword: "",
        familyNum: 1
      });

      onClose();
    } catch (error) {
      toast({
        title: 'アカウント作成失敗',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
              
              <Button
                variant="outline"
                colorScheme="teal"
                width="full"
                onClick={onOpen}
              >
                新規登録
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>

      {/* サインアップモーダル */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>新規アカウント作成</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>ユーザーID</FormLabel>
                <Input
                  name="userId"
                  value={signupForm.userId}
                  onChange={handleSignupInputChange}
                  placeholder="ユーザーIDを入力"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>名前</FormLabel>
                <Input
                  name="name"
                  value={signupForm.name}
                  onChange={handleSignupInputChange}
                  placeholder="お名前を入力"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>パスワード</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={signupForm.password}
                  onChange={handleSignupInputChange}
                  placeholder="8文字以上"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>パスワード（確認）</FormLabel>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={signupForm.confirmPassword}
                  onChange={handleSignupInputChange}
                  placeholder="パスワードを再入力"
                />
              </FormControl>

              <FormControl>
                <FormLabel>世帯人数</FormLabel>
                <Input
                  name="familyNum"
                  type="number"
                  value={signupForm.familyNum}
                  onChange={handleSignupInputChange}
                  min={1}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSignup}>
              登録
            </Button>
            <Button variant="ghost" onClick={onClose}>キャンセル</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
            <Route path="/person" element={<Person user={user} setUser={setUser} onLogout={handleLogout} />} />
            <Route path="/manage" element={<Manage user={user} />} />
            <Route path="/log" element={<Log user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      )}
    </ChakraProvider>
  );
};

export default App;