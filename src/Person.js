// Person.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
  Divider,
  Text
} from '@chakra-ui/react';
import { Navigation } from './components/Navigation';
import { api } from './services/api';

const Person = ({ user, setUser, onLogout }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editInfo, setEditInfo] = useState({
    Name: user.Name,
    Familynum: user.Familynum,
    Password: '',
    PasswordConfirm: '',
  });
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditInfo(prev => ({
      ...prev,
      [name]: name === 'Familynum' ? parseInt(value) || 0 : value
    }));
  };

  const validateForm = () => {
    if (editInfo.Password !== editInfo.PasswordConfirm) {
      toast({
        title: 'パスワードが一致しません',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (editInfo.Password && editInfo.Password.length < 8) {
      toast({
        title: 'パスワードは8文字以上必要です',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleLogout = () => {
    toast({
      title: 'ログアウトしました',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    onLogout();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const updateData = {
        Name: editInfo.Name,
        Familynum: editInfo.Familynum,
        ...(editInfo.Password ? { Password: editInfo.Password } : {})
      };

      const updatedUser = await api.updateUser(user.UID, updateData);
      setUser(updatedUser);
      
      toast({
        title: '更新成功',
        description: 'プロフィールが更新されました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: '更新失敗',
        description: '情報の更新に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box pb={20}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" fontSize="2xl" textAlign="center">個人情報</Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Stat bg="white" p={5} borderRadius="lg" boxShadow="md">
              <StatLabel>名前</StatLabel>
              <StatNumber>{user.Name}</StatNumber>
            </Stat>
            <Stat bg="white" p={5} borderRadius="lg" boxShadow="md">
              <StatLabel>世帯人数</StatLabel>
              <StatNumber>{user.Familynum}</StatNumber>
              <StatHelpText>人</StatHelpText>
            </Stat>
          </SimpleGrid>

          <VStack spacing={4}>
            <Button colorScheme="blue" size="lg" onClick={onOpen}>
              情報を編集
            </Button>
            <Divider />
            <Button 
              colorScheme="red" 
              variant="outline" 
              size="lg" 
              width="200px"
              onClick={handleLogout}
            >
              ログアウト
            </Button>
          </VStack>
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>個人情報の編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>名前</FormLabel>
                <Input
                  name="Name"
                  value={editInfo.Name}
                  onChange={handleInputChange}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>世帯人数</FormLabel>
                <Input
                  name="Familynum"
                  type="number"
                  value={editInfo.Familynum}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>新しいパスワード（変更する場合のみ）</FormLabel>
                <Input
                  name="Password"
                  type="password"
                  value={editInfo.Password}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>パスワード確認</FormLabel>
                <Input
                  name="PasswordConfirm"
                  type="password"
                  value={editInfo.PasswordConfirm}
                  onChange={handleInputChange}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              保存
            </Button>
            <Button variant="ghost" onClick={onClose}>キャンセル</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Navigation />
    </Box>
  );
};

export default Person;