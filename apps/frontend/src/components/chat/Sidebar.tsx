'use client';

import { LogOut, MessageSquarePlus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth';
import { useChatStore } from '@/lib/store/chat';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewConversation: () => void;
}

export function Sidebar({ isOpen, onToggle, onNewConversation }: SidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { conversations, currentConversation, setCurrentConversation } = useChatStore();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <>
      <div
        className={cn(
          'flex h-full w-80 flex-col border-r bg-muted/10 transition-all duration-300',
          !isOpen && '-ml-80'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="font-semibold">Conversations</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onNewConversation}>
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setCurrentConversation(conv)}
                  className={cn(
                    'w-full rounded-lg p-3 text-left transition-colors hover:bg-muted',
                    currentConversation?.id === conv.id && 'bg-muted'
                  )}
                >
                  <p className="truncate font-medium">{conv.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{user?.username}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}
