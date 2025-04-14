import React from "react";

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
  const handleCopy = () => navigator.clipboard.writeText(code);

  return (
    <div className="relative max-w-full">
      <pre className="bg-black text-white p-3 rounded-md overflow-x-auto max-w-full">
        <code className="whitespace-pre">{code}</code>
      </pre>
      <button
        className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 text-sm rounded"
        onClick={handleCopy}
      >
        복사
      </button>
    </div>
  );
};

export default CodeBlock;