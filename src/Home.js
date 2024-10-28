import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  List,
  ListItem,
  IconButton,
  Flex,
  HStack,
  Input,
  useToast,
  Badge,
  Button,
  ButtonGroup,
  Grid,
  Progress,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip
} from '@chakra-ui/react';
import {
  ShoppingBag,
  Calendar,
  AlertCircle,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle2,
  Bell, 
  BellRing, 
  BellDot
} from 'lucide-react';
import { Navigation } from './components/Navigation';
import { api } from './services/api';
import { notificationService } from './services/notification';

const Home = ({ user }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const initializeHome = async () => {
      try {
        if (!notificationService.hasPermissionStored()) {
          const hasPermission = await notificationService.requestPermission();
          if (hasPermission) {
            toast({
              title: '通知が許可されました',
              description: '商品の交換時期が近づくとお知らせします',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
          }
        }

        const items = await api.getItems(user.UID);
        setShoppingList(items);
        
        if (Notification.permission === 'granted') {
          await notificationService.checkItemsAndNotify(items);
        }
      } catch (error) {
        console.error('初期化に失敗しました:', error);
        toast({
          title: 'データの取得に失敗しました',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    initializeHome();

    const interval = setInterval(async () => {
      try {
        const items = await api.getItems(user.UID);
        setShoppingList(items);
        if (Notification.permission === 'granted') {
          await notificationService.checkItemsAndNotify(items);
        }
      } catch (error) {
        console.error('定期チェックに失敗しました:', error);
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user.UID, toast]);

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

  toast({
    title: '連続通知を開始しました',
    description: '3つの通知が順番に表示されます',
    status: 'info',
    duration: 2000,
    isClosable: true,
  });
};

// 商品期限切れのテスト通知
const handleTestExpirationNotification = () => {
  const testItem = {
    Item: "テスト商品",
    Span: 30,
    Lastday: "2024-01-01"
  };
  notificationService.checkItemsAndNotify([testItem]);
  
  toast({
    title: '期限切れ通知をテスト送信しました',
    status: 'info',
    duration: 2000,
    isClosable: true,
  });
};

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

  const calculateProgress = (item) => {
    const daysRemaining = notificationService.calculateDaysUntilReplacement(item);
    const totalDays = item.Span;
    const progress = Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100));
    return progress;
  };

  const getStatusColor = (daysRemaining) => {
    if (daysRemaining <= 0) return 'red';
    if (daysRemaining <= 3) return 'orange';
    if (daysRemaining <= 7) return 'yellow';
    return 'green';
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'red';
    if (progress >= 70) return 'orange';
    if (progress >= 50) return 'yellow';
    return 'teal';
  };

  return (
    <Box minH="100vh" bg="gray.50" pb={20}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          {/* ヘッダー */}
          <Box textAlign="center" w="full">
            <Heading 
              as="h1" 
              size="xl" 
              color="teal.600"
              fontFamily="'Zen Maru Gothic', sans-serif"
              mb={4}
            >
              買い物管理
            </Heading>
            <Text fontSize="lg" color="gray.600">
              {user.Name}さんの商品一覧
            </Text>
          </Box>

          {/* 概要カード */}
          <Grid 
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} 
            gap={6} 
            w="full"
          >
            <Card>
              <CardBody>
                <VStack align="start">
                  <Icon as={ShoppingBag} w={6} h={6} color="teal.500" />
                  <Text fontWeight="bold">登録商品数</Text>
                  <Heading size="xl">{shoppingList.length}</Heading>
                </VStack>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <VStack align="start">
                  <Icon as={AlertCircle} w={6} h={6} color="orange.500" />
                  <Text fontWeight="bold">要確認商品</Text>
                  <Heading size="xl">
                    {shoppingList.filter(item => 
                      notificationService.calculateDaysUntilReplacement(item) <= 7
                    ).length}
                  </Heading>
                </VStack>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <VStack align="start">
                  <Icon as={Calendar} w={6} h={6} color="blue.500" />
                  <Text fontWeight="bold">今月の購入予定</Text>
                  <Heading size="xl">
                    {shoppingList.filter(item => {
                      const daysRemaining = notificationService.calculateDaysUntilReplacement(item);
                      return daysRemaining <= 30 && daysRemaining > 0;
                    }).length}
                  </Heading>
                </VStack>
              </CardBody>
            </Card>
          </Grid>

          {/* 開発用のテストボタン */}
          {process.env.NODE_ENV === 'development' && (
            <Card w="full" bg="gray.50" borderStyle="dashed">
              <CardBody>
                <VStack spacing={4}>
                  <Heading as="h3" size="sm" color="gray.600">
                    開発用通知テスト
                  </Heading>
                  <ButtonGroup size="sm" colorScheme="purple" variant="outline">
                    <Tooltip label="単一の通知をテスト">
                      <Button
                        leftIcon={<Icon as={Bell} />}
                        onClick={handleTestNotification}
                      >
                        シンプル通知
                      </Button>
                    </Tooltip>
                    <Tooltip label="複数の通知を連続して送信">
                      <Button
                        leftIcon={<Icon as={BellRing} />}
                        onClick={handleTestMultipleNotifications}
                      >
                        連続通知
                      </Button>
                    </Tooltip>
                    <Tooltip label="期限切れ商品の通知をテスト">
                      <Button
                        leftIcon={<Icon as={BellDot} />}
                        onClick={handleTestExpirationNotification}
                      >
                        期限切れ通知
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* 商品リスト */}
          <VStack spacing={4} w="full">
            {shoppingList.map((item) => {
              const daysRemaining = notificationService.calculateDaysUntilReplacement(item);
              const progress = calculateProgress(item);
              return (
                <Card key={item.Item} w="full" variant="outline">
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <Flex justify="space-between" align="center">
                        <HStack spacing={4}>
                          <Icon 
                            as={CheckCircle2} 
                            w={6} 
                            h={6} 
                            color={`${getStatusColor(daysRemaining)}.500`} 
                          />
                          <Box>
                            <Heading size="md">{item.Item}</Heading>
                            <Text fontSize="sm" color="gray.500">
                              前回の購入: {new Date(item.Lastday).toLocaleDateString('ja-JP')}
                            </Text>
                          </Box>
                        </HStack>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<MoreVertical />}
                            variant="ghost"
                            size="sm"
                          />
                          <MenuList>
                            <MenuItem icon={<Edit />}>編集</MenuItem>
                            <MenuItem 
                              icon={<Trash2 />} 
                              onClick={() => handleDelete(item.Item)}
                              color="red.500"
                            >
                              削除
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Flex>

                      <Box>
                        <Flex justify="space-between" align="center" mb={2}>
                          <Text fontSize="sm" fontWeight="bold">
                            使用状況
                          </Text>
                          <Badge 
                            colorScheme={getStatusColor(daysRemaining)}
                            variant="subtle"
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            {daysRemaining <= 0 
                              ? '交換時期超過'
                              : `残り${daysRemaining}日`}
                          </Badge>
                        </Flex>
                        <Tooltip 
                          label={`使用期間: ${item.Span}日 / 残り: ${daysRemaining}日`}
                          hasArrow
                        >
                          <Box>
                            <Progress 
                              value={progress} 
                              colorScheme={getProgressColor(progress)}
                              borderRadius="full"
                              size="sm"
                            />
                          </Box>
                        </Tooltip>
                      </Box>

                      <Box>
                        <Text fontSize="sm" mb={2}>購入日を更新</Text>
                        <Input
                          type="date"
                          value={item.Lastday}
                          onChange={(e) => handleNextReplacementDateChange(item.Item, e.target.value)}
                          size="sm"
                        />
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              );
            })}
          </VStack>
        </VStack>
      </Container>
      <Navigation />
    </Box>
  );
};

export default Home;