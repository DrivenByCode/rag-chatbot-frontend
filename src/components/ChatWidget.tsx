import { useEffect, useRef, useState } from 'react'; // useRef와 useEffect 추가
import { Provider, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, createChatStore, RootState } from '@/store';
import { useChatWithRedux } from '@/hooks/useChatWithRedux';
import { ChatWidgetConfig } from '@/types/chat';
import { clearSession, createSession } from '@/store/slices/chatSlice';
import { v4 as uuidv4 } from 'uuid';
import MessageItem from '@/components/MessageItem';

// 내부적으로 사용할 위젯 컴포넌트
const ChatWidgetInner: React.FC<ChatWidgetConfig> = ({
  apiUrl,
  userIdentifier,
  initialMessages,
  theme = 'light',
  position = 'bottom-right',
  width = '350px',
  height = '500px',
  title = '채팅 지원',
  placeholder = '메시지를 입력하세요...',
  showHeader = true,
  showCloseButton = true,
  showRestartButton = true,
  onMessageSent,
  onMessageReceived,
  onError,
  containerStyle,
  headerStyle,
  bubbleStyle,
  inputStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { currentSessionId } = useSelector((state: RootState) => state.chat);
  // 메시지 컨테이너에 대한 ref 추가
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, isLoading } = useChatWithRedux({
    apiUrl,
    userIdentifier,
    initialMessages,
    onMessageSent,
    onMessageReceived,
    onError,
  });

  // 메시지가 추가되면 스크롤을 아래로 이동시키는 효과
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]); // messages가 변경될 때마다 실행

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  // 위젯 위치에 따른 스타일 계산
  const getPositionStyle = () => {
    switch (position) {
      case 'bottom-right':
        return { bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { bottom: '20px', left: '20px' };
      case 'top-right':
        return { top: '20px', right: '20px' };
      case 'top-left':
        return { top: '20px', left: '20px' };
      default:
        return { bottom: '20px', right: '20px' };
    }
  };

  // 테마에 따른 스타일 계산
  const getThemeClass = () => {
    return theme === 'dark'
      ? 'bg-gray-800 text-white'
      : 'bg-white text-gray-800';
  };

  return (
    <div className="fixed z-50" style={{ ...getPositionStyle() }}>
      {/* 챗봇 버튼 */}
      {!isOpen && (
        <button
          className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center ${
            theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
          } text-white hover:opacity-90 transition-opacity`}
          onClick={() => setIsOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* 챗봇 대화창 */}
      {isOpen && (
        <div
          className={`rounded-lg shadow-xl overflow-hidden flex flex-col ${getThemeClass()}`}
          style={{
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
            ...containerStyle,
          }}
        >
          {/* 헤더 */}
          {showHeader && (
            <div
              className={`p-3 flex justify-between items-center ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-blue-500 text-white'
              }`}
              style={headerStyle}
            >
              <h3 className="font-medium">{title}</h3>
              <div className="flex space-x-2">
                {showRestartButton && (
                  <button
                    className="text-sm p-1 rounded hover:bg-opacity-20 hover:bg-black"
                    onClick={() => {
                      // 대화 초기화 로직
                      if (currentSessionId) {
                        dispatch(clearSession(currentSessionId));
                        // 새 세션 생성
                        dispatch(createSession({ initialMessages: [] }));
                        // 선택적: 초기화 메시지 표시
                        if (typeof onMessageReceived === 'function') {
                          onMessageReceived({
                            id: uuidv4(),
                            content:
                              '대화가 초기화되었습니다. 새로운 대화를 시작해보세요.',
                            role: 'bot',
                            timestamp: Date.now(),
                          });
                        }
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                )}
                {showCloseButton && (
                  <button
                    className="text-sm p-1 rounded hover:bg-opacity-20 hover:bg-black"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 메시지 영역 */}
          <div
            ref={messagesContainerRef}
            className="flex-grow overflow-y-auto p-4"
            style={{ height: '60vh' }}
          >
            {/* 메시지 목록 */}
            {messages.map((message, index) => (
              <MessageItem key={index} message={message} style={bubbleStyle} />
            ))}
            {isLoading && (
              <div className="flex justify-center my-2">
                <div className="loading-indicator">
                  <div className="dot-flashing"></div>
                </div>
              </div>
            )}
          </div>

          {/* 입력 영역 */}
          <form
            className={`p-3 border-t ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}
            onSubmit={handleSendMessage}
          >
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className={`flex-1 p-2 rounded-md ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                style={inputStyle}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`px-4 rounded-r ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                } disabled:opacity-50`}
                disabled={!inputValue.trim() || isLoading}
              >
                전송
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// 외부 노출용 위젯 컴포넌트 (Redux Provider 포함)
export const ChatWidget: React.FC<ChatWidgetConfig> = (props) => {
  // 각 위젯 인스턴스마다 독립적인 스토어 생성
  const store = createChatStore();

  return (
    <Provider store={store}>
      <ChatWidgetInner {...props} />
    </Provider>
  );
};
