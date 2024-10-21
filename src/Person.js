import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Button,
  useBreakpointValue,
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
  HStack
} from '@chakra-ui/react';

const Person = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '山田 太郎',
    age: 35,
    email: 'taro.yamada@example.com',
    address: '東京都渋谷区〇〇町1-2-3',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editInfo, setEditInfo] = useState({...personalInfo});

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const statBgColor = useColorModeValue('white', 'gray.600');

  const fontSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const headingSize = useBreakpointValue({ base: '2xl', md: '3xl' });
  const buttonSize = useBreakpointValue({ base: 'xs', md: 'sm' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditInfo(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = () => {
    setPersonalInfo(editInfo);
    onClose();
  };

  return (
    <Box pb={20}>  {/* Increase bottom padding to account for the navigation bar */}
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" fontSize={headingSize} textAlign="center">個人情報</Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Stat bg={statBgColor} p={5} borderRadius="lg" boxShadow="md">
              <StatLabel fontSize={fontSize}>名前</StatLabel>
              <StatNumber fontSize={fontSize}>{personalInfo.name}</StatNumber>
            </Stat>
            <Stat bg={statBgColor} p={5} borderRadius="lg" boxShadow="md">
              <StatLabel fontSize={fontSize}>年齢</StatLabel>
              <StatNumber fontSize={fontSize}>{personalInfo.age}</StatNumber>
              <StatHelpText fontSize={fontSize}>歳</StatHelpText>
            </Stat>
            <Stat bg={statBgColor} p={5} borderRadius="lg" boxShadow="md">
              <StatLabel fontSize={fontSize}>メールアドレス</StatLabel>
              <StatNumber fontSize={fontSize}>{personalInfo.email}</StatNumber>
            </Stat>
            <Stat bg={statBgColor} p={5} borderRadius="lg" boxShadow="md">
              <StatLabel fontSize={fontSize}>住所</StatLabel>
              <StatNumber fontSize={fontSize}>{personalInfo.address}</StatNumber>
            </Stat>
          </SimpleGrid>

          <Box textAlign="center" mt={6}>
            <Button colorScheme="blue" size="lg" onClick={onOpen}>
              情報を編集
            </Button>
          </Box>
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
                <Input name="name" value={editInfo.name} onChange={handleInputChange} />
              </FormControl>
              <FormControl>
                <FormLabel>年齢</FormLabel>
                <Input name="age" type="number" value={editInfo.age} onChange={handleInputChange} />
              </FormControl>
              <FormControl>
                <FormLabel>メールアドレス</FormLabel>
                <Input name="email" type="email" value={editInfo.email} onChange={handleInputChange} />
              </FormControl>
              <FormControl>
                <FormLabel>住所</FormLabel>
                <Input name="address" value={editInfo.address} onChange={handleInputChange} />
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

      {/* Navigation bar at the bottom */}
      <Box 
        position="fixed" 
        bottom={0} 
        left={0} 
        right={0} 
        bg="white" 
        boxShadow="0 -2px 10px rgba(0, 0, 0, 0.1)"
      >
        <Container maxW="container.xl">
          <HStack justifyContent="space-around" py={2}>
            <Link to="/" style={{ flex: 1 }}>
              <Button colorScheme="teal" size={buttonSize} w="full">ホーム</Button>
            </Link>
            <Link to="/person" style={{ flex: 1 }}>
              <Button colorScheme="blue" size={buttonSize} w="full">個人画面</Button>
            </Link>
            <Link to="/manage" style={{ flex: 1 }}>
              <Button colorScheme="green" size={buttonSize} w="full">消耗品登録</Button>
            </Link>
            <Link to="/log" style={{ flex: 1 }}>
              <Button colorScheme="red" size={buttonSize} w="full">購入品入力</Button>
            </Link>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Person;