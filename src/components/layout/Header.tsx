"use client";
import { signout } from "@/api/auth-actions";
import { getUserInfo } from "@/api/user-action";
import { UserInfo } from "@/types/userInfoType";
import { calculateLevelInfo } from "@/utlis/challenge/levelCalculator";
import { createClient } from "@/utlis/supabase/client";
import { userStore } from "@/zustand/userStore";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { loginUser, user, logoutUser } = userStore();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { href: "/challenge", label: "데일리 챌린지" },
    { href: "/calculator", label: "탄소 계산기" },
    { href: "/map", label: "친환경 가게 Map" },
    { href: "/community", label: "커뮤니티" }
  ];

  const handleLogout = async () => {
    await signout();
    logoutUser();
    alert("로그아웃 되었습니다.");
    const paths = [
      "/mypage",
      "/mypage/challenge",
      "mypage/history",
      "mypage/like/free",
      "mypage/like/anabada",
      "mypage/post/free",
      "mypage/post/anabada",
      "/challenge"
    ];
    if (paths.includes(pathname)) {
      router.push("/login");
    }
    setIsMenuOpen(false);
  };

  const supabase = createClient();
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "INITIAL_SESSION") {
    }
    if (event === "SIGNED_IN") {
      loginUser({
        email: session?.user.email as string,
        accessToken: session?.access_token as string,
        id: session?.user.id as string,
        isAuthenticated: true
      });
    }
  });

  const levelInfo = calculateLevelInfo(userInfo?.user_point ?? 0);

  useEffect(() => {
    const getUserFetch = async () => {
      const res = await getUserInfo(user.id);
      setUserInfo(res);
    };
    getUserFetch();
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 클라이언트 환경에서만 실행되도록
      if (isMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    }
  }, [isMenuOpen]);

  return (
    <header className="bg-[#0D9C36] relative">
      <nav
        className="max-w-[1200px] mx-auto flex flex-row justify-between px-4"
        aria-label="Main Navigation"
      >
        {/* 로고 */}
        <ul className="flex justify-center items-center h-20">
          <li className="relative w-[100px] h-[20px]">
            <Link href="/">
              <Image
                src="/images/ecomoa2.png"
                alt="에코모아로고"
                fill
                className="object-contain"
              />
            </Link>
          </li>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden md:flex-row-center space-x-4 ml-14 text-white text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`p-2 rounded-full border transition-colors
                  ${
                    pathname.includes(item.href)
                      ? "border-white text-white font-bold"
                      : "border-transparent text-white hover:text-gray-300 hover:border-gray-300"
                  }
                `}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </div>
        </ul>

        {/* 데스크톱 유저 메뉴 */}
        <ul className="hidden md:flex-row-center space-x-4">
          {!user.isAuthenticated ? (
            <ul className="flex-row-center gap-[32px] text-white">
              <li>
                <Link href="/login" className="hover:text-gray-300">
                  <button className="border-none rounded text-[14px] bg-[#00691E] w-[80px] h-[28px]">
                    로그인
                  </button>
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="flex-row-center gap-[32px] text-white">
              <li className="flex-row-center gap-[9px]">
                <figure className="w-[28px] h-[28px] rounded-full bg-[#00691E]">
                  <Image
                    src={levelInfo.profileSmall}
                    alt="프로필 이미지"
                    width={28}
                    height={28}
                  />
                </figure>
                <Link
                  href="/mypage"
                  className="text-[14px] hover:text-gray-300"
                >
                  마이페이지
                </Link>
              </li>
              <li>
                <button
                  className="border-none rounded text-[14px] bg-[#00691E] w-[80px] h-[28px] hover:text-gray-300"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </li>
            </ul>
          )}
        </ul>

        {/* 모바일 햄버거 버튼 */}
        <div className="md:hidden flex flex-row">
          <Link
            href="/mypage"
            className="flex items-center gap-3 rounded-lg p-3"
            onClick={() => setIsMenuOpen(false)}
          >
            <figure className="w-[28px] h-[28px] rounded-full bg-[#00691E]">
              <Image
                src={levelInfo.profileSmall}
                alt="프로필 이미지"
                width={28}
                height={28}
              />
            </figure>
          </Link>
          <button
            className="flex items-center text-white p-4 border-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? null : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 ">
          {/* 상단 헤더 */}
          <div className="bg-[#0D9C36] h-20 px-4 flex justify-between items-center">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <div className="relative w-[100px] h-[20px]">
                <Image
                  src="/images/ecomoa2.png"
                  alt="에코모아로고"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            <div className="flex flex-row">
              <Link
                href="/mypage"
                className="flex items-center gap-3 rounded-lg p-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <figure className="w-[28px] h-[28px] rounded-full bg-[#00691E]">
                  <Image
                    src={levelInfo.profileSmall}
                    alt="프로필 이미지"
                    width={28}
                    height={28}
                  />
                </figure>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-white p-4 border-none"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* 메뉴 내용 */}
          <div className="flex flex-col h-[calc(100%-80px)]">
            <nav className="flex-1">
              <ul>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-6 py-10 border-b border-gray-200
                        ${
                          pathname.includes(item.href)
                            ? "font-bold bg-gray-50"
                            : "hover:bg-gray-50"
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 모바일 유저 메뉴 */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              {!user.isAuthenticated ? (
                <Link
                  href="/login"
                  className="block w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <button className="w-full p-3 text-white bg-[#0D9C36] rounded-lg">
                    로그인
                  </button>
                </Link>
              ) : (
                <div className="space-y-4">
                  <button
                    className="w-full p-3 text-white bg-[#0D9C36] rounded-lg"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
