import { CSSProperties, useState } from 'react';
import { Message } from '@/types/chat';
import MessageContent from '@/components/MessageContent';
import CopyButton from '@/components/CopyButton';
import { LOADING_MESSAGE } from '@/constants/chatConstants';

const MessageItem: React.FC<{
  message: Message;
  style?: CSSProperties;
}> = ({ message, style }) => {
  const isUserMessage = message.role === 'user';
  const [hovered, setHovered] = useState(false);

  // LOADING_MESSAGE인 경우엔 복사 버튼 숨김
  const showCopyButton =
    !message.content.includes('```') &&
    message.content.trim().length > 0 &&
    message.content !== LOADING_MESSAGE;

  return (
    <div
      className={`flex mb-2 ${isUserMessage ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative inline-block max-w-[90%]">
        <div
          className={`
            relative 
            p-6 
            pb-10  /* 아래쪽 여백을 충분히 줌 */
            rounded-lg 
            whitespace-normal 
            break-words 
            overflow-x-auto
            ${isUserMessage ? 'bg-blue-100' : 'bg-green-100 text-left'}
          `}
        >
          {/* role이 user이면 preserveWhitespace를 true로 전달 */}
          <MessageContent
            content={message.content}
            preserveWhitespace={isUserMessage}
          />
          {showCopyButton && hovered && (
            <div className="absolute bottom-2 right-2 z-10">
              <CopyButton text={message.content} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
