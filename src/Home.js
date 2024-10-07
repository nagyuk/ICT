import React from 'react';
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
} from '@chakra-ui/react';

const HomePage = () => {
  return (
    <Box>
      <Container maxW="container.xl" py={10}>
        <Heading as="h1" mb={6}>ようこそ、ホームページへ</Heading>
        <Text fontSize="xl" mb={10}>
          ここはログイン後のホームページです。下部のタブから他のページに移動できます。
        </Text>
      </Container>

      <Tabs isFitted variant="enclosed" position="fixed" bottom={0} left={0} right={0} bg="white">
        <TabList>
          <Tab>ホーム</Tab>
          <Tab>プロフィール</Tab>
          <Tab>設定</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Text>ホームページの内容</Text>
          </TabPanel>
          <TabPanel>
            <Text>プロフィールページの内容</Text>
          </TabPanel>
          <TabPanel>
            <Text>設定ページの内容</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default HomePage;