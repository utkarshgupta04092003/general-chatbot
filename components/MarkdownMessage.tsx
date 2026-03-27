"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownMessageProps = {
  content: string;
  linkColor?: string;
  codeBg?: string;
  preBg?: string;
};

export function MarkdownMessage({
  content,
  linkColor = "text-indigo-600",
  codeBg = "bg-gray-100",
  preBg = "bg-gray-100",
}: MarkdownMessageProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline font-medium hover:opacity-80 break-all ${linkColor}`}
          />
        ),
        p: ({ ...props }) => <p {...props} className="mb-2 last:mb-0" />,
        ul: ({ ...props }) => <ul {...props} className="list-disc ml-4 mb-2" />,
        ol: ({ ...props }) => (
          <ol {...props} className="list-decimal ml-4 mb-2" />
        ),
        li: ({ ...props }) => <li {...props} className="mb-1" />,
        code: ({ ...props }) => (
          <code
            {...props}
            className={`${codeBg} rounded px-1 py-0.5 font-mono text-xs`}
          />
        ),
        pre: ({ ...props }) => (
          <pre
            {...props}
            className={`${preBg} rounded p-2 mb-2 overflow-x-auto font-mono text-xs`}
          />
        ),
        strong: ({ ...props }) => <strong {...props} className="font-bold" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
