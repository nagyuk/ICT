import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  useToast,
  useBreakpointValue,
} from '@chakra-ui/react';

const Manage = () => {
  const [productName, setProductName] = useState('');
  const [initialCycle, setInitialCycle] = useState('');
  const [products, setProducts] = useState([]);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (productName && initialCycle) {
      const newProduct = {
        id: Date.now(),
        name: productName,
        cycle: parseInt(initialCycle),
      };
      setProducts([...products, newProduct]);
      setProductName('');
      setInitialCycle('');
      toast({
        title: '商品を登録しました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: '全ての項目を入力してください',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const buttonSize = useBreakpointValue({ base: 'xs', md: 'sm' });

  return (
    <Box pb={20}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" fontSize="2xl" textAlign="center">消耗品管理</Heading>
          
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>商品名</FormLabel>
                <Input
                  placeholder="商品名を入力"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>初期周期（日数）</FormLabel>
                <Input
                  placeholder="初期周期を入力"
                  type="number"
                  value={initialCycle}
                  onChange={(e) => setInitialCycle(e.target.value)}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" w="full">
                登録
              </Button>
            </VStack>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={4} fontSize="xl">
              登録済み商品一覧
            </Heading>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>商品名</Th>
                    <Th>初期周期（日）</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products.map((product) => (
                    <Tr key={product.id}>
                      <Td>{product.name}</Td>
                      <Td>{product.cycle}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </VStack>
      </Container>

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

export default Manage;