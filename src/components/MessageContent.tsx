import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import CodeBlock from '@/components/CodeBlock';

interface MessageContentProps {
  content: string;
  preserveWhitespace?: boolean;
}

const MessageContent: React.FC<MessageContentProps> = ({
  content,
  preserveWhitespace,
}) => {
  // 코드 블록 처리를 위한 정규식 (코드 블록은 split 처리)
  const codeRegex = /```(\w+)?\n([\s\S]+?)```/g;
  const parts = content.split(codeRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (index % 3 === 2) {
          // 코드 블록인 경우
          return <CodeBlock key={index} code={part.trim()} />;
        } else {
          return (
            <ReactMarkdown
              key={index}
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                // preserveWhitespace가 true면 pre-wrap을, 아니면 normal 처리
                p: ({ node, ...props }) => (
                  <span {...props} className="inline-block whitespace-normal" />
                ),
                // 취소선(del 태그)을 일반 텍스트로 변환
                del: ({ node, ...props }) => <span {...props} />,
              }}
            >
              {part}
            </ReactMarkdown>
          );
        }
      })}
    </>
  );
};

export default MessageContent;
