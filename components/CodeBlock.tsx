import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import Highlight, { Prism } from 'prism-react-renderer';
import type { Language, PrismTheme } from 'prism-react-renderer';

// 다크모드 테마
const darkTheme: PrismTheme = {
  plain: {
    color: '#e2e8f0',
    backgroundColor: 'transparent',
  },
  styles: [
    {
      types: ['keyword', 'builtin'],
      style: {
        color: '#a5b4fc',  // 연한 라벤더
      },
    },
    {
      types: ['class-name', 'function'],
      style: {
        color: '#93c5fd',  // 연한 하늘색
      },
    },
    {
      types: ['comment'],
      style: {
        color: '#94a3b8',
        fontStyle: 'italic' as const,
      },
    },
    {
      types: ['string', 'attr-value'],
      style: {
        color: '#bef264',  // 연한 라임
      },
    },
    {
      types: ['number', 'constant'],
      style: {
        color: '#93c5fd',  // 연한 하늘색
      },
    },
    {
      types: ['variable', 'attr-name'],
      style: {
        color: '#d8b4fe',  // 연한 보라
      },
    },
    {
      types: ['operator', 'punctuation'],
      style: {
        color: '#cbd5e1',  // 연한 회색
      },
    },
    {
      types: ['tag'],
      style: {
        color: '#86efac',  // 연한 민트
      },
    },
    {
      types: ['property'],
      style: {
        color: '#fde68a',  // 연한 크림
      },
    },
  ],
};

// 라이트모드 테마
const lightTheme: PrismTheme = {
  plain: {
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  styles: [
    {
      types: ['keyword', 'builtin'],
      style: {
        color: '#a5b4fc',  // 연한 라벤더
      },
    },
    {
      types: ['class-name', 'function'],
      style: {
        color: '#7dd3fc',  // 연한 하늘색
      },
    },
    {
      types: ['comment'],
      style: {
        color: '#e2e8f0',  // 연한 회색
        fontStyle: 'italic' as const,
      },
    },
    {
      types: ['string', 'attr-value'],
      style: {
        color: '#86efac',  // 연한 민트
      },
    },
    {
      types: ['number', 'constant'],
      style: {
        color: '#93c5fd',  // 연한 하늘색
      },
    },
    {
      types: ['variable', 'attr-name'],
      style: {
        color: '#ffffff',  // 흰색
      },
    },
    {
      types: ['operator', 'punctuation'],
      style: {
        color: '#ffffff',  // 흰색
      },
    },
    {
      types: ['tag'],
      style: {
        color: '#67e8f9',  // 연한 시안
      },
    },
    {
      types: ['property'],
      style: {
        color: '#fde68a',  // 연한 크림
      },
    },
  ],
};

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

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
        theme={isDarkMode ? darkTheme : lightTheme}
      >
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre style={{ 
            margin: 0, 
            background: 'transparent',
            paddingTop: '48px', 
            paddingLeft: '8px', 
            paddingRight: '8px'
          }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i, style: { background: 'transparent', display: 'flex' } })}>
                <span style={{ 
                  userSelect: 'none',
                  width: '2ch',
                  textAlign: 'right',
                  marginRight: '1.5rem',
                  opacity: 0.5,
                  flexShrink: 0,
                  color: isDarkMode ? '#94a3b8' : '#ffffff'  // 라인 번호 색상 변경
                }}>
                  {i + 1}
                </span>
                <span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
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