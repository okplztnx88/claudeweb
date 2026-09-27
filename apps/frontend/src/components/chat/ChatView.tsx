'use client';

import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/lib/store/chat';
import { socketClient } from '@/lib/socket';
import { useToast } from '@/hooks/use-toast';
import { MessageList } from './MessageList';
import { conversationsApi } from '@/lib/api';

interface ChatViewProps {
  isSidebarOpen: boolean;
}

export function ChatView({ isSidebarOpen }: ChatViewProps) {
  const { currentConversation, messages, setMessages, addMessage, updateMessage, setLoading, isLoading } =
    useChatStore();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentConversation) {
      loadMessages();
      joinConversation();
    }

    return () => {
      if (currentConversation) {
        leaveConversation();
      }
    };
  }, [currentConversation?.id]);

  useEffect(() => {
    const socket = socketClient.getSocket();
    if (!socket) return;

    socket.on('chat:message', (data) => {
      addMessage(data.message);
    });

    socket.on('chat:stream', (data) => {
      updateMessage(data.messageId, data.content);
    });

    socket.on('chat:complete', (data) => {
      updateMessage(data.message.id, data.message.content);
      setLoading(false);
    });

    socket.on('chat:error', (error) => {
      toast({
        title: 'Error',
        description: error.error,
        variant: 'destructive',
      });
      setLoading(false);
    });

    return () => {
      socket.off('chat:message');
      socket.off('chat:stream');
      socket.off('chat:complete');
      socket.off('chat:error');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!currentConversation) return;

    try {
      const response = await conversationsApi.getOne(currentConversation.id);
      setMessages(response.data.conversation.messages || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    }
  };

  const joinConversation = () => {
    const socket = socketClient.getSocket();
    if (socket && currentConversation) {
      socket.emit('conversation:join', currentConversation.id);
    }
  };

  const leaveConversation = () => {
    const socket = socketClient.getSocket();
    if (socket && currentConversation) {
      socket.emit('conversation:leave', currentConversation.id);
    }
  };

  const handleSend = () => {
    if (!input.trim() || !currentConversation || isLoading) return;

    const socket = socketClient.getSocket();
    if (!socket?.connected) {
      toast({
        title: 'Error',
        description: 'Not connected to server',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    socket.emit(
      'chat:message',
      {
        conversationId: currentConversation.id,
        content: input.trim(),
      },
      (response: any) => {
        if (response.error) {
          toast({
            title: 'Error',
            description: response.error,
            variant: 'destructive',
          });
          setLoading(false);
        }
      }
    );

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentConversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome to ClaudeWeb</h2>
          <p className="mt-2 text-muted-foreground">
            Select a conversation or create a new one to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="font-semibold">{currentConversation.title}</h2>
      </div>

      {/* Messages */}
      <MessageList messages={messages} />
      <div ref={messagesEndRef} />

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
