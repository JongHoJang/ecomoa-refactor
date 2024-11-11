// components/Page.tsx

"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Post } from "@/types/community";
import { communityApi } from "@/api/communityApi";
import CommunityNav from "../components/CommunityNav";
import PostCard from "../components/PostCard";
import Image from "next/image";

const Page = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
  };

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      const { data, error } = await communityApi.getPost("free");
      if (error) {
        setError(error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    getPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.post_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  return (
    <div className="bg-[#F2F9F2] overflow-x-hidden overflow-y-hidden mt-12">
      <label className="text-xl font-bold mb-4 mt-12">
        친환경 활동을 공유해 보세요
      </label>

      <div className="bg-[#F4FFF4] overflow-y-hidden">
        <div className="flex flex-col w-[1200px]">
          <CommunityNav />
          <input
            type="text"
            placeholder="키워드를 검색해 보세요"
            className="border-none mt-4 flex w-[380px] h-[52px] p-[19px_20px] flex-col justify-center items-start gap-[10px] flex-shrink-0 rounded-[40px] bg-[#DCECDC]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <label>{filteredPosts.length} 건</label>
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

          <div className="flex flex-col h-[620px] overflow-y-auto mb-4">
            {/* 로딩 중 표시 */}
            {loading && <p>로딩 중...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {filteredPosts.map((post) => (
              <PostCard post={post} type="free" key={post.post_id} />
            ))}
          </div>
        </div>
      </div>

      {/* 고정된 이미지 버튼 */}
      <div className="fixed bottom-[52px] right-[32px] z-10">
        <Link href="/community/post">
          <Image
            src="/community/addPost.png" // public 폴더 안에 이미지 파일 위치
            alt="게시글 작성"
            width={64}
            height={64}
            className="cursor-pointer"
          />
        </Link>
      </div>
    </div>
  );
};

export default Page;
