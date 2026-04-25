import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Components } from 'react-markdown';

interface FormattedMessageProps {
  content: string;
  isUser?: boolean;
}

export default function FormattedMessage({ content, isUser = false }: FormattedMessageProps) {
  // Custom components for markdown rendering
  const components: Components = {
    // Code blocks with syntax highlighting
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (!inline && language) {
        return (
          <div style={{ margin: '8px 0', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '4px 12px',
              fontSize: '12px',
              fontFamily: 'Manrope',
              fontWeight: '500',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{language}</span>
              <button
                onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
              >
                Копировать
              </button>
            </div>
            <SyntaxHighlighter
              style={oneDark}
              language={language}
              PreTag="div"
              customStyle={{
                margin: 0,
                borderRadius: '0 0 8px 8px',
                fontSize: '13px',
                fontFamily: 'DM Mono, monospace'
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        );
      }
      
      // Inline code
      return (
        <code
          style={{
            backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'DM Mono, monospace',
            fontSize: '13px',
            color: isUser ? '#fff' : '#d6336c',
            fontWeight: '500'
          }}
          {...props}
        >
          {children}
        </code>
      );
    },
    
    // Bold text - make it more prominent
    strong({ children }) {
      return (
        <strong
          style={{
            color: isUser ? '#fff' : '#2563eb',
            fontWeight: '600',
            fontSize: '15px'
          }}
        >
          {children}
        </strong>
      );
    },
    
    // Italic text
    em({ children }) {
      return (
        <em
          style={{
            color: isUser ? 'rgba(255,255,255,0.9)' : '#64748b',
            fontStyle: 'italic'
          }}
        >
          {children}
        </em>
      );
    },
    
    // Headers
    h1({ children }) {
      return (
        <h1
          style={{
            color: isUser ? '#fff' : '#1e293b',
            fontSize: '20px',
            fontWeight: '700',
            margin: '16px 0 8px 0',
            borderBottom: `2px solid ${isUser ? 'rgba(255,255,255,0.3)' : '#e2e8f0'}`,
            paddingBottom: '4px'
          }}
        >
          {children}
        </h1>
      );
    },
    
    h2({ children }) {
      return (
        <h2
          style={{
            color: isUser ? '#fff' : '#334155',
            fontSize: '18px',
            fontWeight: '600',
            margin: '12px 0 6px 0'
          }}
        >
          {children}
        </h2>
      );
    },
    
    h3({ children }) {
      return (
        <h3
          style={{
            color: isUser ? '#fff' : '#475569',
            fontSize: '16px',
            fontWeight: '600',
            margin: '10px 0 4px 0'
          }}
        >
          {children}
        </h3>
      );
    },
    
    // Lists
    ul({ children }) {
      return (
        <ul
          style={{
            color: isUser ? '#fff' : '#374151',
            paddingLeft: '20px',
            margin: '8px 0'
          }}
        >
          {children}
        </ul>
      );
    },
    
    ol({ children }) {
      return (
        <ol
          style={{
            color: isUser ? '#fff' : '#374151',
            paddingLeft: '20px',
            margin: '8px 0'
          }}
        >
          {children}
        </ol>
      );
    },
    
    li({ children }) {
      return (
        <li
          style={{
            margin: '4px 0',
            lineHeight: '1.5'
          }}
        >
          {children}
        </li>
      );
    },
    
    // Blockquotes
    blockquote({ children }) {
      return (
        <blockquote
          style={{
            borderLeft: `4px solid ${isUser ? 'rgba(255,255,255,0.5)' : '#3b82f6'}`,
            paddingLeft: '16px',
            margin: '12px 0',
            fontStyle: 'italic',
            color: isUser ? 'rgba(255,255,255,0.9)' : '#64748b',
            backgroundColor: isUser ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
            padding: '8px 16px',
            borderRadius: '0 8px 8px 0'
          }}
        >
          {children}
        </blockquote>
      );
    },
    
    // Links
    a({ children, href }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: isUser ? '#93c5fd' : '#3b82f6',
            textDecoration: 'underline',
            fontWeight: '500'
          }}
        >
          {children}
        </a>
      );
    },
    
    // Tables
    table({ children }) {
      return (
        <div style={{ overflowX: 'auto', margin: '12px 0' }}>
          <table
            style={{
              borderCollapse: 'collapse',
              width: '100%',
              fontSize: '13px'
            }}
          >
            {children}
          </table>
        </div>
      );
    },
    
    thead({ children }) {
      return (
        <thead
          style={{
            backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : '#f8fafc'
          }}
        >
          {children}
        </thead>
      );
    },
    
    th({ children }) {
      return (
        <th
          style={{
            padding: '8px 12px',
            textAlign: 'left',
            borderBottom: `2px solid ${isUser ? 'rgba(255,255,255,0.3)' : '#e2e8f0'}`,
            fontWeight: '600',
            color: isUser ? '#fff' : '#374151'
          }}
        >
          {children}
        </th>
      );
    },
    
    td({ children }) {
      return (
        <td
          style={{
            padding: '8px 12px',
            borderBottom: `1px solid ${isUser ? 'rgba(255,255,255,0.2)' : '#e2e8f0'}`,
            color: isUser ? '#fff' : '#374151'
          }}
        >
          {children}
        </td>
      );
    }
  };

  return (
    <div style={{
      fontFamily: 'Manrope, sans-serif',
      lineHeight: '1.6',
      color: isUser ? '#fff' : '#374151'
    }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
