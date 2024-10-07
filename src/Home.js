import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Container,
  Button,
  Stack,
  VStack,
  List,
  ListItem,
  ListIcon,
  IconButton,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // react-router-domからLinkをインポート
import { CheckCircleIcon, DeleteIcon } from '@chakra-ui/icons';

const Home = () => {
  // サンプルの買い物リスト
  const [shoppingList, setShoppingList] = useState([
    { id: 1, item: 'おむつ' },
    { id: 2, item: 'トイレットペーパー' },
    { id: 3, item: 'パンツ' },
  ]);

  // 買い物リストのアイテムを削除する関数
  const handleDelete = (id) => {
    setShoppingList(shoppingList.filter((item) => item.id !== id));
  };

  return (
    <Box>
      <Container maxW="container.xl" py={10}>
        <Heading as="h1" mb={6}>ようこそ、ホームページへ</Heading>
        <Text fontSize="xl" mb={10}>
          ここはログイン後のホームページです。下部のタブから他のページに移動できます。
        </Text>

        {/* 遷移ボタンを追加 */}
        <Stack direction="row" spacing={4} mb={10}>
          <Link to="/person">
            <Button colorScheme="blue">個人画面</Button>
          </Link>
          <Link to="/manage">
            <Button colorScheme="green">消耗品登録</Button>
          </Link>
          <Link to="/log">
            <Button colorScheme="red">購入品入力</Button>
          </Link>
        </Stack>

        {/* 買い物リスト表示 */}
        <Heading as="h2" size="lg" mb={4}>買い物リスト</Heading>
        <VStack align="start" spacing={4}>
          <List spacing={3}>
            {shoppingList.map((item) => (
              <ListItem key={item.id} display="flex" alignItems="center">
                <ListIcon as={CheckCircleIcon} color="green.500" />
                {item.id}: {item.item}
                {/* 削除ボタン */}
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Delete item"
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(item.id)}
                  ml={4}
                />
              </ListItem>
            ))}
          </List>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;