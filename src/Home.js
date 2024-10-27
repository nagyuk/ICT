import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  List,
  ListItem,
  ListIcon,
  IconButton,
  Flex,
  HStack,
  Input,
  useToast,
  Badge,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { CheckCircleIcon, DeleteIcon } from '@chakra-ui/icons';
import { Navigation } from './components/Navigation';
import { api } from './services/api';
import { notificationService } from './services/notification';

const Home = ({ user }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const toast = useToast();

  // 通知の設定
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const hasPermission = await notificationService.requestPermission();
        if (hasPermission) {
          toast({
            title: '通知が許可されました',
            description: '商品の交換時期が近づくとお知らせします',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: '通知が許可されていません',
            description: 'ブラウザの設定から通知を許可してください',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('通知の設定に失敗しました:', error);
      }
    };

    setupNotifications();
  }, [toast]);

  // 商品データの取得と通知チェック
  useEffect(() => {
    const checkItems = async () => {
      try {
        const items = await api.getItems(user.UID);
        setShoppingList(items);
        await notificationService.checkItemsAndNotify(items);
      } catch (error) {
        console.error('商品チェックに失敗しました:', error);
        toast({
          title: 'データの取得に失敗しました',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    checkItems();
    // 15分ごとにチェック
    const interval = setInterval(checkItems, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user.UID, toast]);

  const handleDelete = async (itemName) => {
    try {
      const newList = shoppingList.filter(item => item.Item !== itemName);
      setShoppingList(newList);
      toast({
        title: '商品を削除しました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: '削除に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleNextReplacementDateChange = async (itemName, newDate) => {
    try {
      await api.updateLastPurchase(user.UID, itemName);
      const updatedItems = await api.getItems(user.UID);
      setShoppingList(updatedItems);
      toast({
        title: '更新成功',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: '更新に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // テスト通知用の関数
  const handleTestNotification = () => {
    new Notification('テスト通知', {
      body: 'これはテスト通知です',
      requireInteraction: true
    });
    toast({
      title: 'テスト通知を送信しました',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  // 複数のテストケース用の関数
  const handleTestMultipleNotifications = () => {
    // 即時通知
    new Notification('通知テスト1', {
      body: '即時通知です',
    });

    // 3秒後に通知
    setTimeout(() => {
      new Notification('通知テスト2', {
        body: '3秒後の通知です',
      });
    }, 3000);

    // 6秒後に通知
    setTimeout(() => {
      new Notification('通知テスト3', {
        body: '6秒後の通知です',
      });
    }, 6000);
  };

  // 商品期限切れのテスト通知
  const handleTestExpirationNotification = () => {
    const testItem = {
      Item: "テスト商品",
      Lastday: new Date(2024, 0, 1), // 2024年1月1日
      Span: new Date(2024, 0, 30)    // 2024年1月30日
    };
    notificationService.checkItemsAndNotify([testItem]);
  };

  // 残り日数に基づいて色を決定
  const getReplacementBadge = (item) => {
    const daysRemaining = notificationService.calculateDaysUntilReplacement(item);
    let color = 'green';
    if (daysRemaining <= 0) {
      color = 'red';
    } else if (daysRemaining <= 3) {
      color = 'orange';
    } else if (daysRemaining <= 7) {
      color = 'yellow';
    }

    return (
      <Badge colorScheme={color} ml={2}>
        {daysRemaining <= 0 
          ? '交換時期超過'
          : `残り${daysRemaining}日`}
      </Badge>
    );
  };

  return (
    <Box pb={16}>
      <Container maxW="container.xl" py={4}>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" textAlign="center">ようこそ、{user.Name}さん</Heading>
          <Text textAlign="center">
            買い物リスト
          </Text>

          {/* 開発用のテストボタン */}
          {process.env.NODE_ENV === 'development' && (
            <Box 
              p={4} 
              bg="gray.50" 
              borderRadius="md"
              border="1px dashed"
              borderColor="gray.300"
            >
              <VStack spacing={4}>
                <Heading as="h3" size="sm" color="gray.600">
                  開発用通知テスト
                </Heading>
                <ButtonGroup>
                  <Button
                    colorScheme="purple"
                    size="sm"
                    onClick={handleTestNotification}
                  >
                    シンプル通知テスト
                  </Button>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={handleTestMultipleNotifications}
                  >
                    連続通知テスト
                  </Button>
                  <Button
                    colorScheme="orange"
                    size="sm"
                    onClick={handleTestExpirationNotification}
                  >
                    期限切れ通知テスト
                  </Button>
                </ButtonGroup>
              </VStack>
            </Box>
          )}

          <List spacing={3}>
            {shoppingList.map((item) => (
              <ListItem key={item.Item}>
                <Flex alignItems="center" justifyContent="space-between">
                  <Flex direction="column" flex="1">
                    <HStack alignItems="center">
                      <ListIcon as={CheckCircleIcon} color="green.500" />
                      <Text fontSize="lg">{item.Item}</Text>
                      {getReplacementBadge(item)}
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      前回の購入日: {new Date(item.Lastday).toLocaleDateString()}
                    </Text>
                    <Input
                      type="date"
                      value={new Date(item.Lastday).toISOString().split('T')[0]}
                      onChange={(e) => handleNextReplacementDateChange(item.Item, e.target.value)}
                      size="sm"
                      mt={2}
                    />
                  </Flex>
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete item"
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(item.Item)}
                    ml={4}
                  />
                </Flex>
              </ListItem>
            ))}
          </List>
        </VStack>
      </Container>
      <Navigation />
    </Box>
  );
};

export default Home;