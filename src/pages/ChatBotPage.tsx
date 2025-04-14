import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Message } from '@/types/chat';
import {
  EMPTY_CHAT_MESSAGE,
  ERROR_MESSAGE,
  LOADING_MESSAGE,
  MESSAGE_DURATION,
} from '@/constants/chatConstants';
import { useChatApi } from '@/api/chat';
import MessageItem from '@/components/MessageItem';

const ChatBotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionId] = useState<string>(`session-${Date.now()}`);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { sendChatMessage } = useChatApi();

  // 메시지가 추가되면 채팅 영역을 맨 아래로 스크롤
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (): Promise<void> => {
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: 'user', content: input };
    const tempBotMessage: Message = { role: 'bot', content: LOADING_MESSAGE };
    setMessages((prev) => [...prev, userMessage, tempBotMessage]);
    setLoading(true);
    setInput('');

    try {
      const { success, response } = await sendChatMessage(input, sessionId);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'bot',
          content: success ? response! : ERROR_MESSAGE,
        };
        return updated;
      });
    } catch (error) {
      console.error('메시지 전송 중 오류 발생:', error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'bot',
          content: ERROR_MESSAGE,
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 단독: 전송, Shift+Enter: 줄바꿈
    if (event.key === 'Enter' && !event.shiftKey && !loading) {
      event.preventDefault();
      void handleSendMessage();
    } else if (event.key === 'Enter' && event.shiftKey) {
      // 별도 조치 없이 줄바꿈 허용 (텍스트영역이 자체 개행 처리함)
    }
  };

  return (
    // 최상위 컨테이너: overflow-hidden으로 바깥 영역 스크롤 막음
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 overflow-hidden">
      <Card className="flex flex-col flex-grow max-w-2xl w-full mx-auto">
        {/* 메시지 영역: 내부 스크롤 (빨간색 영역) */}
        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto p-4"
          style={{ height: '60vh' }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
              <p>{EMPTY_CHAT_MESSAGE}</p>
              <p>{MESSAGE_DURATION}</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageItem key={index} message={message} />
            ))
          )}
        </div>
        {/* 전송 영역: 카드 하단에 일반적으로 자리 잡음 */}
        <div className="p-4 bg-gray-50 border-t flex flex-col space-y-2 flex-shrink-0 min-h-[250px]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Shift + Enter로 개행, Enter로 전송"
            className="border rounded-lg p-2 resize-none w-full"
            rows={3}
            disabled={loading}
          ></textarea>
          <Button
            onClick={() => void handleSendMessage()}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r blue-500 text-white px-4 py-2 font-bold rounded shadow-lg transition-transform hover:scale-105"
          >
            {loading ? '처리 중...' : '전송'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatBotPage;
