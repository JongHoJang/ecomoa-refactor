"use client";
import { getLikePosts } from "@/api/user-action";
import Like from "@/app/community/components/Like";
import PostCard from "@/app/community/components/PostCard";
import { LikePosts, TypeProps } from "@/types/userInfoType";
import { userStore } from "@/zustand/userStore";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Myposts = ({ type }: TypeProps) => {
  const { user } = userStore();
  const [selected, setSelected] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
  };

  // 좋아요 게시글
  const { data: likePosts, isLoading } = useQuery<LikePosts[] | null>({
    queryKey: ["likePosts", user.id],
    queryFn: () => getLikePosts(user.id),
    enabled: !!user.id
  });

  const freePosts: LikePosts[] | undefined = likePosts?.filter(
    (post) => post.posts.params?.type === "free"
  );
  const anabadaPosts: LikePosts[] | undefined = likePosts?.filter(
    (post) => post.posts.params?.type === "anabada"
  );

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col w-[1200px]">
        <Link href={"/mypage"} className="border-b-slate-500 w-[1200]">
          <div className="flex items-center mb-[20px] pt-[64.5px] border-b-2 border-#D5D7DD pb-2">
            <ChevronLeft />
            <p className="font-wanted text-[16px] font-[600]">마이페이지</p>
          </div>
        </Link>
        {/* 네비게이션 바 */}
        <div className="mb-[48px]">
          <p className="text-[32px] font-[700] leading-[44.8px] tracking-[-0.2px]">
            나의 좋아요
          </p>
          <p className="text-[#00691E] font-wanted text-[20px] font-[500] leading-[30px] tracking-[-0.2px]">
            내가 좋아요한 게시글을 확인해보세요
          </p>
        </div>
        <div className="flex mb-4">
          {type === "free" ? (
            <>
              <Link href="/mypage/like/free" passHref>
                <button className="w-[600px] h-12 border-b-2 border-black border-t-0 border-l-0 border-r-0 font-semibold flex items-center justify-center">
                  자유 게시판
                </button>
              </Link>
              <Link href="/mypage/like/anabada" passHref>
                <button className="w-[600px] h-12 border-b-2 border-t-0 border-l-0 border-r-0 border-#D5D7DD text-[#D5D7DD]">
                  아나바다 시장
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/mypage/like/free" passHref>
                <button className="w-[600px] h-12 border-b-2 border-t-0 border-l-0 border-r-0 border-#D5D7DD text-[#D5D7DD]">
                  자유 게시판
                </button>
              </Link>

              <Link href="/mypage/like/anabada" passHref>
                <button
                  className="w-[600px] h-12 border-b-2 border-black border-t-0 border-l-0
              border-r-0 font-semibold flex items-center justify-center"
                >
                  아나바다 시장
                </button>
              </Link>
            </>
          )}
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <label>{likePosts?.length} 건</label>
            <div
              onClick={() => handleSelect("latest")}
              className="cursor-pointer flex items-center"
            >
              {selected === "latest" && (
                <span className="text-black mr-1">✔</span>
              )}
              <label>최신순</label>
            </div>
            <div
              onClick={() => handleSelect("popular")}
              className="cursor-pointer flex items-center"
            >
              {selected === "popular" && (
                <span className="text-black mr-1">✔</span>
              )}
              <label>인기순</label>
            </div>
            <div
              onClick={() => handleSelect("likes")}
              className="cursor-pointer flex items-center"
            >
              {selected === "likes" && (
                <span className="text-black mr-1">✔</span>
              )}
              <label>좋아요</label>
            </div>
            <div
              onClick={() => handleSelect("comments")}
              className="cursor-pointer flex items-center"
            >
              {selected === "comments" && (
                <span className="text-black mr-1">✔</span>
              )}
              <label>댓글순</label>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap h-[620px] overflow-y-auto mb-4 gap-5">
          {isLoading && <p>로딩 중...</p>}
          {type === "anabada"
            ? // 아나바다 타입인 경우 PostCard를 렌더링
              anabadaPosts?.map((post) => (
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
                    user_info: post.posts.user_info
                      ? { user_nickname: post.posts.user_info.user_nickname }
                      : { user_nickname: "" } // user_info가 없을 경우 빈 값으로 대체
                  }}
                  type={"anabada"}
                />
              ))
            : // 자유 게시판 타입인 경우 아티클을 렌더링
              freePosts?.map((post) => (
                <article
                  key={post.posts.post_id}
                  className="pl-[28px] pt-[28px] w-full h-[205px] rounded-[12px] bg-[#FFF] border border-[#E8F3E8] flex flex-row p-4"
                  style={{ boxShadow: "0px 0px 40px 0px rgba(0, 0, 0, 0.02)" }}
                >
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">
                      <Link
                        href={`/community/free/${post.posts.post_id}`}
                        className="font-wanted text-[18px] font-[700] leading-[27px] tracking-[-0.18px] mt-[28px] mb-[20px]"
                      >
                        {post.posts.post_title}
                      </Link>
                    </h2>
                    <p>{post.posts.post_content}</p>

                    <div className="mb-4 mt-5">
                      <label className="mt-[16px] text-[#8A91A1] mr-[14px]">
                        {post.writername}님
                      </label>
                      <time className="text-[#8A91A1]">
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
                    <div className="flex-none w-[160px] h-[160px] ml-4 flex flex-wrap gap-1 rounded-[12px]">
                      <Image
                        key={0}
                        src={post.posts.post_img[0]}
                        alt="Post image"
                        width={149}
                        height={149}
                        className="object-contain h-full rounded-[12px] "
                      />
                    </div>
                  )}
                </article>
              ))}
        </div>
      </div>
    </div>
  );
};
export default Myposts;