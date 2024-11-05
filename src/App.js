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
  HStack,
  Icon,
  Container,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
  ChakraProvider
} from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ShoppingCart, Clock, Users, CheckCircle } from 'lucide-react';
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

  // App.js の handleLogin 関数を修正
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    console.log('ログイン試行:', { userId, password });  // デバッグ用

    const userData = await api.login(userId, password);
    console.log('ログイン成功:', userData);  // デバッグ用

    setUser(userData);
    setErrorMessage("");

    toast({
      title: 'ログイン成功',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  } catch (error) {
    console.error('ログインエラー詳細:', error);  // デバッグ用
    setErrorMessage(error.message || "ユーザーIDまたはパスワードが正しくありません");
    
    toast({
      title: 'ログイン失敗',
      description: error.message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
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

  const renderFeatureCard = (icon, title, description) => (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="md"
      flex="1"
      minW={{ base: "full", md: "250px" }}
      transition="transform 0.3s ease"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "lg"
      }}
    >
      <Icon as={icon} w={8} h={8} color="teal.500" mb={4} />
      <Text fontWeight="bold" mb={2}>{title}</Text>
      <Text color="gray.600" fontSize="sm">{description}</Text>
    </Box>
  );

  const renderLogin = () => (
    <Box
      minH="100vh"
      bg="gray.50"
      py={8}
    >
      <Container maxW="container.xl">
        <VStack spacing={12}>
          {/* ヘッダーセクション */}
          <Box textAlign="center" w="full" pt={8}>
            <Heading
              as="h1"
              size="2xl"
              color="teal.600"
              mb={4}
              fontFamily="'Zen Maru Gothic', sans-serif"
            >
              買い物生成
            </Heading>
            <Text
              fontSize="xl"
              color="gray.600"
              mb={8}
              fontFamily="'Zen Maru Gothic', sans-serif"
            >
              日用品の買い忘れを防ぐ、あなたの生活アシスタント
            </Text>
          </Box>

          {/* メインコンテンツ */}
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={8}
            w="full"
            align="center"
          >
            {/* 左側: 特徴説明 */}
            <VStack
              spacing={6}
              flex="1"
              align="stretch"
              display={{ base: "none", lg: "flex" }}
            >
              {renderFeatureCard(
                ShoppingCart,
                "買い物リスト自動生成",
                "使用頻度を学習し、必要な時期に自動でリストアップ"
              )}
              {renderFeatureCard(
                Clock,
                "タイミングの最適化",
                "家族の人数や使用量に合わせて、最適な購入タイミングを提案"
              )}
              {renderFeatureCard(
                CheckCircle,
                "買い忘れ防止",
                "商品の残量が少なくなる前に通知でお知らせ"
              )}
              {renderFeatureCard(
                Users,
                "家族で共有",
                "家族メンバーと買い物リストを共有して、効率的に管理"
              )}
            </VStack>

            {/* 右側: ログインフォーム */}
            <Box
              bg="white"
              p={8}
              borderRadius="xl"
              boxShadow="lg"
              w={{ base: "full", lg: "400px" }}
              mx="auto"
            >
              <VStack spacing={6}>
                <Heading
                  as="h2"
                  size="md"
                  color="gray.700"
                  fontFamily="'Zen Maru Gothic', sans-serif"
                >
                  ログイン
                </Heading>

                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                  <VStack spacing={4}>
                    <FormControl id="userId" isRequired>
                      <FormLabel>ユーザーID</FormLabel>
                      <Input
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="ユーザーIDを入力"
                        bg="gray.50"
                        border="1px"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: "teal.500",
                          boxShadow: "0 0 0 1px teal.500",
                        }}
                      />
                    </FormControl>

                    <FormControl id="password" isRequired>
                      <FormLabel>パスワード</FormLabel>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="パスワードを入力"
                        bg="gray.50"
                        border="1px"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: "teal.500",
                          boxShadow: "0 0 0 1px teal.500",
                        }}
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
                      size="lg"
                      width="full"
                      mt={4}
                    >
                      ログイン
                    </Button>
                    
                    <Text textAlign="center" color="gray.500">
                      または
                    </Text>
                    
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
          </Flex>

          {/* フッター */}
          <Text color="gray.500" fontSize="sm" textAlign="center" pt={8}>
            © 2024 買い物生成 All rights reserved.
          </Text>
        </VStack>
      </Container>

      {/* サインアップモーダル */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="'Zen Maru Gothic', sans-serif">新規アカウント作成</ModalHeader>
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
                  bg="gray.50"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>お名前</FormLabel>
                <Input
                  name="name"
                  value={signupForm.name}
                  onChange={handleSignupInputChange}
                  placeholder="お名前を入力"
                  bg="gray.50"
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
                  bg="gray.50"
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
                  bg="gray.50"
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
                  bg="gray.50"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSignup}>
              登録
            </Button>
            <Button variant="ghost" onClick={onClose}>
              キャンセル
            </Button>
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