import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  useToast,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { Navigation } from './components/Navigation';
import { api } from './services/api';

const Log = ({ user }) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchases, setPurchases] = useState([]);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (productName && quantity && purchaseDate) {
      try {
        const newPurchase = {
          id: Date.now(),
          productName,
          quantity: parseInt(quantity),
          purchaseDate,
        };

        // 購入記録を追加
        setPurchases([...purchases, newPurchase]);

        // 最終購入日を更新
        await api.updateLastPurchase(user.UID, productName);

        // フォームをリセット
        setProductName('');
        setQuantity('');
        setPurchaseDate('');

        toast({
          title: '購入記録を保存しました',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: '保存に失敗しました',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: '全ての項目を入力してください',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box pb={20}>
      <Container maxW="container.xl" py={4}>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" fontSize="2xl" textAlign="center">購入品入力</Heading>
          
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>商品名</FormLabel>
                <Input
                  placeholder="商品名"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>数量</FormLabel>
                <Input
                  placeholder="数量"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>購入日</FormLabel>
                <Input
                  placeholder="購入日"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" w="full">
                保存
              </Button>
            </VStack>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={4} fontSize="xl">
              購入履歴
            </Heading>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>商品名</Th>
                    <Th>数量</Th>
                    <Th>購入日</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {purchases.map((purchase) => (
                    <Tr key={purchase.id}>
                      <Td>{purchase.productName}</Td>
                      <Td>{purchase.quantity}</Td>
                      <Td>{purchase.purchaseDate}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </VStack>
      </Container>
      <Navigation />
    </Box>
  );
};

export default Log;