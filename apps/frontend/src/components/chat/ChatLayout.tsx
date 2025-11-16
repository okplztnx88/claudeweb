'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatView } from './ChatView';
import { useAuthStore } from '@/lib/store/auth';
import { useChatStore } from '@/lib/store/chat';
import { conversationsApi } from '@/lib/api';
import { socketClient } from '@/lib/socket';
import { useToast } from '@/hooks/use-toast';

export function ChatLayout() {
  const { token } = useAuthStore();
  const { setConversations, setCurrentConversation } = useChatStore();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    loadConversations();

    // Connect to socket
    if (token) {
      socketClient.connect(token);
    }

    return () => {
      socketClient.disconnect();
    };
  }, [token]);

  const loadConversations = async () => {
    try {
      const response = await conversationsApi.getAll();
      setConversations(response.data.conversations);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive',
      });
    }
  };

  const handleNewConversation = async () => {
    try {
      const response = await conversationsApi.create({});
      const newConv = response.data.conversation;
      setConversations([newConv, ...useChatStore.getState().conversations]);
      setCurrentConversation(newConv);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create conversation',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewConversation={handleNewConversation}
      />
      <ChatView isSidebarOpen={isSidebarOpen} />
    </div>
  );
}
