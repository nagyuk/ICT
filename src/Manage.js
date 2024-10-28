import React, { useState, useEffect } from 'react';
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
  useToast
} from '@chakra-ui/react';
import { Navigation } from './components/Navigation';
import { api } from './services/api';

// 日付をフォーマットする関数
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const Manage = ({ user }) => {
  const [productName, setProductName] = useState('');
  const [initialCycle, setInitialCycle] = useState('');
  const [items, setItems] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await api.getItems(user.UID);
        setItems(data);
      } catch (error) {
        toast({
          title: 'データの取得に失敗しました',
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
    if (productName && initialCycle) {
      try {
        const cycleInDays = parseInt(initialCycle);
        if (isNaN(cycleInDays) || cycleInDays <= 0) {
          throw new Error('購入周期は1以上の数値を入力してください');
        }

        const newItem = {
          UID: user.UID,
          Item: productName,
          Span: cycleInDays, // 日数として保存
          Lastday: new Date().toISOString() // ISO文字列として保存
        };
        await api.addItem(newItem);

        // フォームをリセット
        setProductName('');
        setInitialCycle('');

        // リストを更新
        const updatedItems = await api.getItems(user.UID);
        setItems(updatedItems);

        toast({
          title: '商品を登録しました',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: error.message || '登録に失敗しました',
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
                <FormLabel>購入周期（日数）</FormLabel>
                <Input
                  placeholder="購入周期を入力"
                  type="number"
                  min="1"
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
                    <Th>購入周期（日）</Th>
                    <Th>前回購入日</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {items.map((item) => (
                    <Tr key={item.Item}>
                      <Td>{item.Item}</Td>
                      <Td>{item.Span}</Td>
                      <Td>{item.Lastday ? formatDate(item.Lastday) : '未購入'}</Td>
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

export default Manage;