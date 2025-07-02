import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import Highlight, { Prism } from 'prism-react-renderer';
import type { Language } from 'prism-react-renderer';
// @ts-ignore
import duotoneDark from 'prism-react-renderer/themes/duotoneDark';
// @ts-ignore
import duotoneLight from 'prism-react-renderer/themes/duotoneLight';

interface CodeBlockProps {
  children: string;
  className?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  className = '',
  filename,
  showLineNumbers = false,
  highlightLines = [],
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

  // 다크모드용 파스텔톤 컬러 팔레트 테마
  const customDarkTheme = {
    plain: {
      backgroundColor: '#23272f', // 어두운 배경
    },
    styles: [
      { types: ['comment'], style: { color: '#6c7086', fontStyle: 'italic' as 'italic' } },
      { types: ['keyword'], style: { color: '#7fdbca', fontWeight: 'bold' as 'bold' } },
      { types: ['function', 'method'], style: { color: '#f6c177' } },
      { types: ['variable', 'attr-name'], style: { color: '#e5e5e5' } },
      { types: ['string', 'inserted'], style: { color: '#a3be8c' } },
      { types: ['number', 'constant'], style: { color: '#d67ad2' } },
      { types: ['type', 'class-name'], style: { color: '#e99287' } },
      { types: ['operator', 'punctuation'], style: { color: '#b4befe' } },
      { types: ['tag'], style: { color: '#f28fad' } },
      { types: ['property'], style: { color: '#f2cdcd' } },
      { types: ['boolean'], style: { color: '#f6c177' } },
      { types: ['namespace'], style: { color: '#b4befe' } },
      { types: ['deleted'], style: { color: '#f28fad' } },
      { types: ['builtin', 'char', 'selector'], style: { color: '#7fdbca' } },
    ],
  };

  const customLightTheme = {
    plain: {
      backgroundColor: '#e5e6eb', // 더 진한 밝은 회색 배경
    },
    styles: [
      { types: ['comment'], style: { color: '#7D8590', fontStyle: 'italic' as 'italic' } },
      { types: ['keyword'], style: { color: '#20B2AA', fontWeight: 'bold' as 'bold' } },
      { types: ['function', 'method'], style: { color: '#FF9800' } },
      { types: ['variable', 'attr-name'], style: { color: '#23272F' } },
      { types: ['string', 'inserted'], style: { color: '#43A047' } },
      { types: ['number', 'constant'], style: { color: '#8E24AA' } },
      { types: ['type', 'class-name'], style: { color: '#1976D2' } },
      { types: ['operator', 'punctuation'], style: { color: '#6C6F85' } },
      { types: ['tag'], style: { color: '#E91E63' } },
      { types: ['property'], style: { color: '#8E24AA' } },
      { types: ['boolean'], style: { color: '#FF9800' } },
      { types: ['namespace'], style: { color: '#6C6F85' } },
      { types: ['deleted'], style: { color: '#E91E63' } },
      { types: ['builtin', 'char', 'selector'], style: { color: '#20B2AA' } },
    ],
  };

  return (
    <div
      className="notion-code-block"
      style={{ border: 'none', boxShadow: 'none', outline: 'none' }}
      tabIndex={-1}
    >
      <div className="notion-code-header" style={isDarkMode ? { color: '#3d3d3d ' } : { color: '#e5e5e5' }}>
        <div className="flex items-center space-x-2">
          {detectedLanguage && (detectedLanguage as string) !== 'text' && (detectedLanguage as string) !== 'plaintext' && (detectedLanguage as string) !== 'plain' && (
            <span className="notion-code-language" style={isDarkMode ? { color: '#3d3d3d' } : { color: '#e5e5e5' }}>
              {detectedLanguage.toUpperCase()}
            </span>
          )}
        </div>
        <div className="notion-code-actions">
          <button
            onClick={handleCopy}
            className="notion-code-button"
            title={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? <Check size={20} color={isDarkMode ? '#3d3d3d' : '#e5e5e5'} /> : <Copy size={20} color={isDarkMode ? '#3d3d3d' : '#e5e5e5'} />}
          </button>
        </div>
      </div>
      <Highlight
        Prism={Prism}
        code={children.trim()}
        language={detectedLanguage}
        theme={!isDarkMode ? customDarkTheme : customLightTheme}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }: any) => (
          <pre className={className} style={style}>
            {tokens.map((line: any, i: number) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                <span className="select-none opacity-50 mr-4 min-w-[2.5rem] text-right inline-block">
                  {i + 1}
                </span>
                {line.map((token: any, key: number) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default CodeBlock; 