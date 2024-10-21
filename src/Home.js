import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Container, Button, VStack, List, ListItem, ListIcon, IconButton, Flex, useBreakpointValue, HStack, Input, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, DeleteIcon } from '@chakra-ui/icons';

const Home = () => {
  const [shoppingList, setShoppingList] = useState([
    { id: 1, item: 'おむつ', nextReplacementDate: '2024-10-22' }, 
    { id: 2, item: 'トイレットペーパー', nextReplacementDate: '2024-11-05' },
    { id: 3, item: 'パンツ', nextReplacementDate: '2024-10-29' },
  ]);

  const toast = useToast();

  // プッシュ通知の許可を要求し、許可状態に基づいて通知を送信する関数
  const requestNotificationPermissionAndNotify = async (item) => {
    if (!('Notification' in window)) {
      console.log('このブラウザはプッシュ通知をサポートしていません');
      return;
    }

    let permission = Notification.permission;

    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission === 'granted') {
      // 通知を送信
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        const options = {
          body: `${item.item}の交換日が明日です。お忘れなく！`,
          icon: 'icon.png', // 任意のアイコン
        };
        registration.showNotification('消耗品の交換通知', options);
      }
    } else if (permission === 'denied') {
      toast({
        title: '通知が拒否されています',
        description: '通知を受け取るには、ブラウザの設定で許可してください',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // 次回交換日が近づいた場合に通知を送る
  const checkReplacementDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // 明日の日付

    shoppingList.forEach((item) => {
      const nextReplacementDate = new Date(item.nextReplacementDate);

      // 次回交換日が明日である場合
      if (nextReplacementDate.toDateString() === tomorrow.toDateString()) {
        requestNotificationPermissionAndNotify(item);
      }
    });
  };

  useEffect(() => {
    // ホーム画面が開かれたときに通知をチェック
    checkReplacementDates();

    // 毎日交換日をチェック
    const intervalId = setInterval(checkReplacementDates, 24 * 60 * 60 * 1000); // 24時間ごとにチェック

    return () => clearInterval(intervalId); // クリーンアップ
  }, [shoppingList]);

  const handleDelete = (id) => {
    setShoppingList(shoppingList.filter((item) => item.id !== id));
  };

  // 次回交換日の更新
  const handleNextReplacementDateChange = (id, newDate) => {
    setShoppingList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, nextReplacementDate: newDate } : item
      )
    );
  };

  const buttonSize = useBreakpointValue({ base: 'xs', md: 'sm' });
  const fontSize = useBreakpointValue({ base: 'md', md: 'xl' });
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl' });

  return (
    <Box pb={16}>  {/* Add bottom padding to account for the navigation bar */}
      <Container maxW="container.xl" py={4}>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" fontSize={headingSize} textAlign="center">ようこそ、ホームページへ</Heading>
          <Text fontSize={fontSize} textAlign="center">
            ここはログイン後のホームページです。下部のボタンから他のページに移動できます。
          </Text>

          <Heading as="h2" fontSize="xl" mb={2}>買い物リスト</Heading>
          <List spacing={3}>
            {shoppingList.map((item) => (
              <ListItem key={item.id}>
                <Flex alignItems="center" justifyContent="space-between">
                  <Flex direction="column">
                    <HStack alignItems="center">
                      <ListIcon as={CheckCircleIcon} color="green.500" />
                      <Text fontSize={fontSize}>{item.item}</Text>
                    </HStack>
                    {/* 次回交換予定日を表示 */}
                    <Text fontSize="sm" color="gray.500">次回交換日: {item.nextReplacementDate}</Text>
                    {/* 次回交換日を変更するための日付入力 */}
                    <Input
                      type="date"
                      value={item.nextReplacementDate}
                      onChange={(e) => handleNextReplacementDateChange(item.id, e.target.value)}
                      size="sm"
                    />
                  </Flex>
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete item"
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(item.id)}
                  />
                </Flex>
              </ListItem>
            ))}
          </List>
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

export default Home;