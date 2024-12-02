"use client";
import { getMyPosts } from "@/api/user-action";
import PostCard from "@/app/community/components/PostCard";
import { Post } from "@/types/community";
import { TypeProps } from "@/types/userInfoType";
import { userStore } from "@/zustand/userStore";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import FormHeader from "@/components/shared/FormHeader";
import PostListSkeleton from "./PostListSkeleton";

const Myposts = ({ type }: TypeProps) => {
  const { user } = userStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // 기본값은 최신순

  // 내가 작성한 게시글 가져오기
  const { data: myPosts, isLoading } = useQuery<Post[] | null>({
    queryKey: ["myPosts", user.id, type, sortOrder],
    queryFn: () => getMyPosts(user.id, type, sortOrder),
    enabled: !!user.id // user.id가 있을 때만 쿼리 실행
  });

  const handleSelect = (option: string) => {
    setSelected(option);
    setSortOrder(option === "latest" ? "desc" : "asc");
  };

  if (isLoading) {
    return <PostListSkeleton type={type} listType="myPost" />;
  }

  return (
    // <div className="flex flex-col w-full min-h-screen mx-auto md:max-w-[1200px] px-[20px]">
    <div className="min-h-full  max-w-[1200px] mx-auto px-[20px]">
      <div className="pb-[52px] w-full min-w-[360px] px-[20px] md:px-0">
        <div className="flex flex-col w-full ">
          <div className="w-full md:pl-0 mt-[76px]">
            <FormHeader text="마이페이지 홈" location="/mypage" />
          </div>
          {/* 네비게이션 바 */}
          <div className="my-[36px] md:my-[48px]">
            <p className="text-[24px] md:text-[32px] font-[700] leading-[33.6px] md:leading-[44.8px] tracking-[-0.24px] md:tracking-[-0.2px] w-full md:ml-0">
              나의 게시글
            </p>
            <p className="mt-[16px] md:mt-[12px] text-[#00691E] text-[16px] md:text-[20px] font-[500] leading-[24px] md:leading-[30px] tracking-[-0.16px] md:tracking-[-0.2px] w-full md:ml-0">
              내가 작성한 게시글을 확인해보세요
            </p>
          </div>
          <div className="flex mb-4 w-full md:ml-0">
            {type === "free" ? (
              <>
                {/* <Link
                  href="/mypage/post/free"
                  passHref
                  className="text-[#00320F] w-1/2 border-b-2 border-black border-t-0 border-l-0 border-r-0"
                >
                  <button className="border-none mx-auto md:w-[600px] h-12 font-[600] flex items-center justify-center">
                    자유 게시판
                  </button>
                </Link> */}
                <Link href="/mypage/post/free" className="flex-1">
                  <div className="h-12 border-b-2 border-black text-black font-bold flex items-center justify-center text-[16px] ">
                    자유 게시판
                  </div>
                </Link>
                <Link href="/mypage/post/anabada" className="flex-1">
                  <div className="h-12 border-b-2 border-[#D5D7DD] text-[#D5D7DD] font-bold flex items-center justify-center text-[16px] ">
                    아나바다 시장
                  </div>
                </Link>
                {/* <Link
                  href="/mypage/post/anabada"
                  passHref
                  className="w-1/2 border-b-2 border-t-0 border-l-0 border-r-0 text-center border-#D5D7DD text-[#D5D7DD]"
                >
                  <button className="border-none mx-auto md:w-[600px] h-12 font-[600] flex items-center justify-center">
                    아나바다 시장
                  </button>
                </Link> */}
              </>
            ) : (
              <>
                <Link href="/mypage/post/free" className="flex-1">
                  <div className="h-12 border-b-2 border-[#D5D7DD] text-[#D5D7DD] font-bold flex items-center justify-center text-[16px]">
                    자유 게시판
                  </div>
                </Link>
                <Link href="/mypage/post/anabada" className="flex-1">
                  <div className="h-12 border-b-2 border-black text-black font-bold flex items-center justify-center text-[16px]">
                    {/* <div className="h-12 border-b-2 border-[#D5D7DD] text-[#D5D7DD] font-bold flex items-center justify-center text-xs md:text-base"> */}
                    아나바다 시장
                  </div>
                </Link>

                {/* <Link
                  href="/mypage/post/free"
                  passHref
                  className="w-1/2 border-b-2 border-t-0 border-l-0 border-r-0 text-center border-#D5D7DD text-[#D5D7DD]"
                >
                  <button className="border-none mx-auto md:w-[600px] h-12 font-[600] flex items-center justify-center">
                    자유 게시판
                  </button>
                </Link>
                <Link
                  href="/mypage/post/anabada"
                  passHref
                  className="text-[#00320F] w-1/2 border-b-2 border-black border-t-0 border-l-0 border-r-0 text-center"
                >
                  <button className="border-none mx-auto md:w-[600px] h-12 font-[600] flex items-center justify-center">
                    아나바다 시장
                  </button>
                </Link> */}
              </>
            )}
          </div>
          {/* 필터링 */}
          <div className="flex justify-between items-center mb-[20px] w-full md:ml-0">
            <div className="flex space-x-4 mb-[10px]">
              <label className="text-[#00691E] font-[600] text-[16px] leading-[24px] tracking-[-0.16px]">
                {myPosts?.length} 건
              </label>
              <div
                onClick={() => handleSelect("latest")}
                className="cursor-pointer flex items-center"
              >
                {selected === "latest" && (
                  <span className="text-black mr-1">✔</span>
                )}
                <label
                  className={
                    selected === "latest" ? "text-black" : "text-[#A1A7B4]"
                  }
                >
                  최신순
                </label>
              </div>
              <div
                onClick={() => handleSelect("oldest")}
                className="cursor-pointer flex items-center"
              >
                {selected === "oldest" && (
                  <span className="text-black mr-1">✔</span>
                )}
                <label
                  className={
                    selected === "oldest" ? "text-black" : "text-[#A1A7B4]"
                  }
                >
                  오래된순
                </label>
              </div>
            </div>
          </div>
          <div className="mb-[80px] flex flex-wrap gap-5 overflow-y-auto max-h-[600px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#D7E8D7] [&::-webkit-scrollbar-thumb]:bg-[#00691E] [&::-webkit-scrollbar-thumb]:rounded-full">
            {isLoading && <p>로딩 중...</p>}
            {myPosts && myPosts?.length > 0 ? (
              myPosts?.map((post) =>
                type === "anabada" ? (
                  <div key={post.post_id} className="w-full md:w-[276px]">
                    <PostCard key={post.post_id} post={post} type={"anabada"} />
                  </div>
                ) : (
                  <PostCard key={post.post_id} post={post} type={"free"} />
                )
              )
            ) : (
              <div className="mx-auto min-h-screen flex items-center justify-center">
                <p className="text-[#8A91A1] text-[20px]">게시글이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
        <div className="pb-[6px]"></div>
      </div>
    </div>
  );
};
export default Myposts;
