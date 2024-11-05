import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
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
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Navigation } from './components/Navigation';
import { api } from './services/api';

const Log = ({ user }) => {
  const today = new Date().toISOString().split('T')[0];
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchaseDate, setPurchaseDate] = useState(today);
  const [purchases, setPurchases] = useState([]);
  const [registeredItems, setRegisteredItems] = useState([]);
  const toast = useToast();

  // ローカルストレージから購入履歴を取得
  useEffect(() => {
    const storedPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
    setPurchases(storedPurchases);
  }, []);

  // 登録済み商品の取得
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await api.getItems(user.UID);
        setRegisteredItems(items);
      } catch (error) {
        toast({
          title: '商品リストの取得に失敗しました',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchItems();
  }, [user.UID, toast]);

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
        const updatedPurchases = [...purchases, newPurchase];
        setPurchases(updatedPurchases);

        // ローカルストレージに保存
        localStorage.setItem('purchases', JSON.stringify(updatedPurchases));

        // 最終購入日を更新
        await api.updateLastPurchase(user.UID, productName);

        // フォームをリセット
        setProductName('');
        setQuantity(1);
        setPurchaseDate(today);

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

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  return (
    <Box pb={20}>
      <Container maxW="container.xl" py={4}>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" fontSize="2xl" textAlign="center">購入品入力</Heading>
          
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>商品名</FormLabel>
                <Select
                  placeholder="商品を選択してください"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                >
                  {registeredItems.map((item) => (
                    <option key={item.Item} value={item.Item}>
                      {item.Item}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>数量</FormLabel>
                <NumberInput
                  min={1}
                  max={99}
                  value={quantity}
                  onChange={handleQuantityChange}
                  keepWithinRange={true}
                  clampValueOnBlur={true}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>購入日</FormLabel>
                <Input
                  type="date"
                  max={today}
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </FormControl>

              <Button 
                type="submit" 
                colorScheme="blue" 
                w="full"
                isDisabled={!productName || !quantity || !purchaseDate}
              >
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
