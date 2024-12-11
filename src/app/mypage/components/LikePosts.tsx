"use client";
import { getLikePosts } from "@/api/user-action";
import Like from "@/app/community/components/Like";
import PostCard from "@/app/community/components/PostCard";
import { LikePosts, TypeProps } from "@/types/userInfoType";
import { userStore } from "@/zustand/userStore";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import PostListSkeleton from "./PostListSkeleton";
import FormHeader from "@/components/shared/FormHeader";

const MyLike = ({ type }: TypeProps) => {
  const { user } = userStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSelect = (option: string) => {
    setSelected(option);
    setSortOrder(option === "latest" ? "desc" : "asc");
  };

  // 좋아요 게시글
  const { data: likePosts, isLoading } = useQuery<LikePosts[] | null>({
    queryKey: ["likePosts", user.id, sortOrder], // 통신 주소
    queryFn: () => getLikePosts(user.id, type, sortOrder),
    enabled: !!user.id
  });

  const freePosts: LikePosts[] | undefined = likePosts?.filter(
    (post) => post.posts.params?.type === "free"
  );
  const anabadaPosts: LikePosts[] | undefined = likePosts?.filter(
    (post) => post.posts.params?.type === "anabada"
  );

  if (isLoading) {
    return <PostListSkeleton type={type} listType="myLike" />;
  }
  return (
    <div className="flex flex-col w-full min-h-screen md:max-w-[1200px] mx-auto px-[20px]">
      <div className="w-full">
        <div className="w-full md:pl-0 mt-[76px]">
          <FormHeader text="마이페이지 홈" location="/mypage" />
        </div>
        {/* 네비게이션 바 */}
        <div className="my-[48px]">
          <p className="text-[24px] md:text-[32px] font-[700] leading-[33.6px] md:leading-[44.8px] tracking-[-0.24px] md:tracking-[-0.2px] w-full md:pl-0">
            나의 좋아요
          </p>
          <p className="mt-[12px] text-[#00691E] text-[16px] md:text-[20px] font-[500] leading-[30px] tracking-[-0.2px] w-full md:pl-0">
            내가 좋아요한 게시글을 확인해보세요
          </p>
        </div>
        <div className="flex mb-4 w-full min-w-[360px] md:pl-0">
          {type === "free" ? (
            <>
              <Link
                href="/mypage/like/free"
                passHref
                className="w-1/2 border-b-2 border-black border-t-0 border-l-0 border-r-0"
              >
                <button className="text-[#00320F] border-none mx-auto h-12 font-[600] flex items-center justify-center">
                  자유 게시판
                </button>
              </Link>
              <Link
                href="/mypage/like/anabada"
                passHref
                className="w-1/2 border-b-2 border-t-0 border-l-0 border-r-0 text-center border-#D5D7DD text-[#D5D7DD]"
              >
                <button className="border-none h-12">아나바다 시장</button>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/mypage/like/free"
                passHref
                className="w-1/2 border-b-2 border-t-0 border-l-0 border-r-0 text-center border-#D5D7DD text-[#D5D7DD]"
              >
                <button className="border-none mx-auto h-12 font-[600] flex items-center justify-center">
                  자유 게시판
                </button>
              </Link>
              <Link
                href="/mypage/like/anabada"
                passHref
                className="text-[#00320F] w-1/2 border-b-2 border-black border-t-0 border-l-0 border-r-0 text-center"
              >
                <button className="border-none mx-auto h-12 font-[600] flex items-center justify-center">
                  아나바다 시장
                </button>
              </Link>
            </>
          )}
        </div>

        {/* 필터링 */}
        <div className="flex justify-between items-center mb-[20px] w-full md:pl-0">
          <div className="flex space-x-4 mb-[10px]">
            {type === "free" ? (
              <label className="text-[#00691E] font-[600] text-[16px] leading-[24px] tracking-[-0.16px]">
                {freePosts?.length} 건
              </label>
            ) : (
              <label className="text-[#00691E] font-[600] text-[16px] leading-[24px] tracking-[-0.16px]">
                {anabadaPosts?.length} 건
              </label>
            )}
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
        <div
          className={`
         ${
           type === "anabada"
             ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
             : "pr-2 mb-[80px] flex flex-wrap gap-5 overflow-y-auto max-h-[600px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#D7E8D7] [&::-webkit-scrollbar-thumb]:bg-[#00691E] [&::-webkit-scrollbar-thumb]:rounded-full"
         } 
       
          `}
        >
          {isLoading && <p>로딩 중...</p>}
          {type === "anabada" ? (
            anabadaPosts && anabadaPosts?.length > 0 ? (
              // 아나바다 타입의 게시글 렌더링
              anabadaPosts?.map((post) => (
                <div key={post.post_id} className="flex jus">
                  <PostCard
                    key={post.posts.post_id}
                    post={{
                      ...post.posts,
                      comment: post.posts.comment || 0,
                      location: post.posts.location || "",
                      price: post.posts.price?.toString() || "",
                      params: {
                        ...post.posts.params,
                        type: post.posts.params?.type || type
                      },
                      user_info: { user_nickname: post.writername }
                    }}
                    type={"anabada"}
                  />
                </div>
              ))
            ) : (
              // 게시글이 없을 경우 표시
              <div className="h-screen flex items-center justify-center mx-auto">
                <p className="text-gray-500 text-lg">게시글이 없습니다.</p>
              </div>
            )
          ) : // 자유 게시판 타입인 경우 아티클을 렌더링
          freePosts && freePosts?.length > 0 ? (
            freePosts?.map((post) => (
              <article
                key={post.posts.post_id}
                className="w-full md:mx-0 px-[20px] pb-[28px] md:p-[28px] md:w-full md:h-[205px] rounded-[12px] bg-[#FFF] border border-[#E8F3E8] flex flex-col md:flex-row"
                style={{
                  boxShadow: "0px 0px 40px 0px rgba(0, 0, 0, 0.02)"
                }}
              >
                <div className="flex-1">
                  <h2 className="text-[18px] md:text-[20px] font-[700] leading-[27px] md:leading-[-0.18px] mb-2 mt-[28px] md:mt-[0]">
                    <Link
                      href={`/community/free/${post.posts.post_id}`}
                      className="text-[18px] font-[700] leading-[27px] tracking-[-0.18px] mt-[28px] mb-[20px]"
                    >
                      {post.posts.post_title}
                    </Link>
                  </h2>
                  <p className="text-[16px] leading-[24px] tracking-[-0.16px]">
                    {post.posts.post_content}
                  </p>
                  <div className="mb-4 mt-5">
                    <label className="text-[14px] leading-[21px] tracking-[-0.14px] mt-[16px] text-[#8A91A1] mr-[14px]">
                      {post.writername}
                      <span className="ml-[4px]"> &middot;</span>
                    </label>
                    <time className="text-[#8A91A1] -ml-[8px] text-[14px] leading-[21px] tracking-[-0.14px]">
                      {new Date(post.posts.created_at).toLocaleDateString()}
                    </time>
                  </div>
                  <div className="flex justify-between items-center mt-[35px]">
                    <div className="flex space-x-4">
                      <Like postId={post.posts.post_id} />
                      <label>댓글 {post.posts.comment || 0}</label>
                    </div>
                  </div>
                </div>
                {post.posts.post_img && post.posts.post_img.length > 0 && (
                  <div className="w-[150px] h-[150px] ml-4 flex flex-wrap gap-1 rounded-[12px] md:hidden pb-[28px]">
                    <Image
                      key={0}
                      src={post.posts.post_img[0]}
                      alt="image"
                      width={150}
                      height={150}
                      className="object-contain h-full rounded-[12px] md:hidden -ml-[15px] mt-[21px]"
                    />
                  </div>
                )}
              </article>
            ))
          ) : (
            // 게시글이 없을 경우 표시
            <div className="h-screen flex items-center justify-center mx-auto">
              <p className="text-gray-500 text-lg">게시글이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MyLike;
