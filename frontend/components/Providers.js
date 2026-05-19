'use client';

import { AuthProvider } from '../context/AuthContext';
import { WebSocketProvider } from '../context/WebSocketContext';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <WebSocketProvider>{children}</WebSocketProvider>
    </AuthProvider>
  );
}
