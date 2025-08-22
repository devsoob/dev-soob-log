import Image from "next/image";
import { Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProfileCard() {
  const [avatarSrc, setAvatarSrc] = useState("/images/soob-profile.png");
  const email = "cholong56@naver.com";

  return (
    <div className="relative p-5 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 mb-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full ring-2 ring-blue-500/20 overflow-hidden bg-gray-200 dark:bg-gray-800">
          <Image
            src={avatarSrc}
            alt="Profile avatar"
            fill
            sizes="64px"
            className="object-cover"
            priority
            onError={() => setAvatarSrc("/images/avatar-fallback.svg")}
            style={{ objectPosition: 'center 20%' }}
          />
        </div>
        <div className="min-w-0">
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">Soobin Choi</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">App Developer</p>
          <a 
            href={`mailto:${email}`} 
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:underline min-h-[44px] min-w-[44px] whitespace-nowrap overflow-hidden text-ellipsis m-0 p-0"
            aria-label={`${email}로 이메일 보내기`}
            title={email}
          >
            {email}
          </a>
        </div>
      </div>

      <div className="mt-4">
        <Link
          href="https://github.com/devsoob"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub 프로필로 이동"
        >
          <Github className="w-4 h-4" />
          <span className="text-sm font-medium">GitHub</span>
        </Link>
      </div>
    </div>
  );
} 