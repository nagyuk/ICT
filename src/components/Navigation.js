import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  HStack,
  Button,
  useBreakpointValue,
} from '@chakra-ui/react';

export const Navigation = () => {
  const buttonSize = useBreakpointValue({ base: 'xs', md: 'sm' });

  return (
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
  );
};

export default Navigation;