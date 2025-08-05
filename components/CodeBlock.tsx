import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Highlight, { Prism } from 'prism-react-renderer';
import type { Language } from 'prism-react-renderer';

interface CodeBlockProps {
  children: string;
  className?: string;
  filename?: string;
  showLineNumbers?: boolean;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  className = '',
  filename,
  showLineNumbers = false,
  language = 'text'
}) => {
  const [copied, setCopied] = useState(false);

  // 언어 추출
  const extractLanguage = (className: string): string => {
    const match = className.match(/language-(\w+)/);
    return match ? match[1] : 'text';
  };
  const detectedLanguage = (extractLanguage(className) || language) as Language;

  // 복사 기능
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '8px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1
      }}>
        {detectedLanguage && (detectedLanguage as string) !== 'text' && (detectedLanguage as string) !== 'plaintext' && (detectedLanguage as string) !== 'plain' && (
          <span style={{ fontSize: '14px' }}>
            {detectedLanguage.toUpperCase()}
          </span>
        )}
        <button
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </button>
      </div>
      <Highlight
        Prism={Prism}
        code={children.trim()}
        language={detectedLanguage}
      >
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre style={{ margin: 0, background: 'transparent', paddingTop: '48px', paddingLeft: '8px', paddingRight: '8px' }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i, style: { background: 'transparent', display: 'flex' } })}>
                <span style={{ 
                  userSelect: 'none',
                  width: '2ch',
                  textAlign: 'right',
                  marginRight: '1.5rem',
                  opacity: 0.5,
                  flexShrink: 0,
                  marginLeft: '-8px'
                }}>
                  {i + 1}
                </span>
                <span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key, style: { background: 'transparent' } })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default CodeBlock; 