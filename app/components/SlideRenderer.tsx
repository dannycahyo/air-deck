import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { cn } from "~/lib/utils";

interface SlideRendererProps {
  markdown: string;
  className?: string;
}

export function SlideRenderer({ markdown, className }: SlideRendererProps) {
  return (
    <div
      className={cn(
        "w-full h-full overflow-y-auto overflow-x-hidden",
        className
      )}
    >
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-5xl md:text-6xl font-bold mb-6 text-foreground"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-3xl md:text-4xl font-semibold mb-3 text-foreground"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="text-xl md:text-2xl mb-4 text-foreground/90" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-outside space-y-3 mb-4 ml-8" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-outside space-y-3 mb-4 ml-8" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-xl md:text-2xl text-foreground/90 pl-2" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-bold text-foreground" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="italic text-foreground" {...props} />
              ),
              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "";
                const codeString = String(children).replace(/\n$/, "");

                return !match ? (
                  <code
                    className="bg-muted px-2 py-1 rounded text-lg font-mono text-foreground"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    className="rounded-lg text-base my-4"
                    customStyle={{
                      margin: 0,
                      borderRadius: "0.5rem",
                      fontSize: "0.95rem",
                    }}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                );
              },
              pre: ({ node, ...props }) => (
                <pre className="mb-4 overflow-x-auto" {...props} />
              ),
              img: ({ node, ...props }) => (
                <img
                  className="max-w-full h-auto rounded-lg shadow-lg my-4 mx-auto"
                  {...props}
                />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-primary pl-4 italic text-xl text-foreground/80 my-4"
                  {...props}
                />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-collapse" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th
                  className="border border-border bg-muted px-4 py-2 text-left text-lg font-semibold"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  className="border border-border px-4 py-2 text-lg"
                  {...props}
                />
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
