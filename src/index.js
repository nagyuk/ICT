import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { ChakraProvider } from '@chakra-ui/react'; // ChakraProvider をインポート

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider> {/* ChakraProvider でアプリ全体をラップ */}
      <App />
    </ChakraProvider>
  </React.StrictMode>
);