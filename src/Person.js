import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const Person = () => {
  return (
    <Box p={5}>
      <Heading as="h2" mb={4}>個人情報画面</Heading>
      <Text>ここに個人情報の内容を表示します。</Text>
    </Box>
  );
};

export default Person;