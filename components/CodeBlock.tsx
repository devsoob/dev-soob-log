import React, { useState, useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, ExternalLink, Play } from 'lucide-react';

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
  showLineNumbers = true,
  highlightLines = [],
  language = 'text'
}) => {
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  // 다크모드 감지
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

  const detectedLanguage = extractLanguage(className) || language;

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

  // CodePen으로 열기
  const openInCodePen = () => {
    const encodedCode = encodeURIComponent(children);
    const encodedTitle = encodeURIComponent(filename || 'Code Example');
    
    const codePenUrl = `https://codepen.io/pen?default-tab=js,result&editors=0010&title=${encodedTitle}&code=${encodedCode}`;
    window.open(codePenUrl, '_blank');
  };

  // JSFiddle으로 열기
  const openInJSFiddle = () => {
    const encodedCode = encodeURIComponent(children);
    const encodedTitle = encodeURIComponent(filename || 'Code Example');
    
    const jsFiddleUrl = `https://jsfiddle.net/?html,js,console,output&title=${encodedTitle}&code=${encodedCode}`;
    window.open(jsFiddleUrl, '_blank');
  };

  // 지원하는 언어 목록
  const supportedLanguages = [
    'javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx',
    'python', 'py', 'java', 'cpp', 'c', 'csharp', 'cs',
    'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
    'html', 'css', 'scss', 'sass', 'less',
    'sql', 'bash', 'shell', 'json', 'yaml', 'yml',
    'markdown', 'md', 'xml', 'dockerfile', 'docker'
  ];

  const isExecutableLanguage = ['javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx', 'html', 'css'].includes(detectedLanguage);

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {filename && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {filename}
            </span>
          )}
          {detectedLanguage !== 'text' && (
            <span className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded">
              {detectedLanguage.toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 실행 버튼 */}
          {isExecutableLanguage && (
            <button
              onClick={openInCodePen}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Open in CodePen"
            >
              <Play size={16} />
            </button>
          )}
          
          {/* 복사 버튼 */}
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* 코드 블록 */}
      <div className="relative" ref={codeRef}>
        <SyntaxHighlighter
          language={detectedLanguage}
          style={isDarkMode ? oneDark : oneLight}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          lineNumberStyle={{
            color: isDarkMode ? '#6b7280' : '#9ca3af',
            fontSize: '0.875rem',
            paddingRight: '1rem',
            minWidth: '2.5rem',
            textAlign: 'right',
            userSelect: 'none'
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            backgroundColor: 'transparent',
            borderRadius: 0
          }}
          lineProps={(lineNumber) => {
            const isHighlighted = highlightLines.includes(lineNumber);
            return {
              style: {
                backgroundColor: isHighlighted 
                  ? (isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)')
                  : 'transparent',
                display: 'block',
                paddingLeft: isHighlighted ? '0.5rem' : '0',
                marginLeft: isHighlighted ? '-0.5rem' : '0',
                borderLeft: isHighlighted 
                  ? `3px solid ${isDarkMode ? '#3b82f6' : '#2563eb'}`
                  : 'none'
              }
            };
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>

      {/* 푸터 - 추가 액션 버튼들 */}
      {isExecutableLanguage && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <button
              onClick={openInCodePen}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <ExternalLink size={12} />
              <span>CodePen</span>
            </button>
            <button
              onClick={openInJSFiddle}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <ExternalLink size={12} />
              <span>JSFiddle</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeBlock; 