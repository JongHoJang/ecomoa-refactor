"use client";

import { Post } from "@/types/community";

import { createClient } from "@/utlis/supabase/client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Supabase 클라이언트 초기화
const supabase = createClient();

const EditPostModal = ({
  type,
  post,
  onSave,
  onClose
}: {
  type: string;
  post: Post;
  onClose: () => void;
  onSave: (post: Post) => void;
}) => {
  const [editedPost, setEditedPost] = useState<Post>(post);
  const [newImage, setNewImage] = useState<string | null>(null); // 새로운 이미지 URL을 상태로 저장

  // 게시글 내용이 변경될 때 상태 업데이트
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    setEditedPost(post); // post가 변경되면 상태 초기화
    // setNewImage(null); // 수정할 때마다 새로운 이미지를 리셋
  }, [post]);

  // 이미지 변경 시 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); // 선택된 파일을 URL로 변환
      setNewImage(fileURL);
    }
  };

  // 이미지 업로드 함수 (Supabase Storage에 이미지 업로드)
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      const { data, error } = await supabase.storage
        .from("posts")
        .upload(`public/${file.name}`, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (error) {
        throw error;
      }

      // 업로드된 이미지의 URL을 가져오기
      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/${data.path}`;
      return imageUrl;
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      throw error;
    }
  };

  // 저장 버튼 클릭 시 호출되는 함수
  const handleSave = async () => {
    const updatedPost = {
      ...editedPost,
      post_img: newImage ? [newImage] : editedPost.post_img // 새 이미지가 있으면 배열로 감싸서 저장
    };

    try {
      if (newImage) {
        // 새로운 이미지가 있으면 Supabase에 업로드
        const file = (document.getElementById("imageInput") as HTMLInputElement)
          .files?.[0];

        if (file) {
          const uploadedImageUrl = await uploadImageToSupabase(file);
          updatedPost.post_img = [uploadedImageUrl]; // 업로드된 이미지 URL을 배열에 담아서 저장
        }
      }

      // 서버에 수정된 게시글 전송 (API 호출로 변경된 게시글을 Supabase에 업데이트)
      const { error } = await supabase
        .from("posts")
        .update({
          post_title: updatedPost.post_title,
          price: updatedPost.price,
          post_content: updatedPost.post_content,
          location: updatedPost.location,
          post_img: updatedPost.post_img // 업데이트된 이미지 배열
        })
        .eq("post_id", updatedPost.post_id);

      if (error) {
        throw error;
      }

      onSave(updatedPost); // 수정된 게시글 상태를 부모 컴포넌트로 전달
    } catch (error) {
      console.error("게시글 수정 실패:", error);
    }
  };

  return (
    <div>
      {type === "free" ? (
        <form className="bg-white p-8 rounded-xl w-[320px] h-700px]  md:w-[990px] md:h-[865px] relative ">
          <label className="text-2xl font-semibold mb-4">자유게시글 수정</label>
          <div className="mt-4">
            <label>제목</label>
            <input
              type="text"
              name="post_title"
              value={editedPost.post_title || ""}
              onChange={handleInputChange}
              className="mt-4 w-full mb-4 p-2 border border-gray-300 rounded-md"
            />
            <label className="mt-4">내용</label>
            <textarea
              name="post_content"
              value={editedPost.post_content || ""}
              onChange={handleInputChange}
              className="mt-4 w-full mb-4 p-2 border border-gray-300 rounded-md leading-normal"
              rows={5}
            />
            <label>사진</label>
            <div className="relative mb-4 mt-4">
              <div className="w-[160px] h-[160px] mb-2">
                {/* 기존 이미지 또는 새 이미지 미리보기 */}
                {newImage ? (
                  <Image
                    src={newImage}
                    alt="사진 미리보기"
                    width={160}
                    height={160}
                    className="object-cover rounded-md w-full h-full"
                  />
                ) : // 기존 이미지 표시 (기존 이미지는 post_img 배열에 저장되어 있음)
                editedPost.post_img && editedPost.post_img.length > 0 ? (
                  <Image
                    src={editedPost.post_img[0]} // 첫 번째 이미지를 표시
                    alt="기존 이미지"
                    width={160}
                    height={160}
                    className="object-cover rounded-md w-full h-full"
                  />
                ) : (
                  <span>사진 없음</span> // 이미지가 없을 때 기본 텍스트 표시
                )}
              </div>
              <button
                type="button" // 'submit' 대신 'button' 타입을 명시
                className="p-2 rounded-full"
                onClick={() => document.getElementById("imageInput")?.click()}
              >
                교체하기
              </button>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange} // 이미지가 변경되면 handleImageChange 호출
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="flex justify-center text-center text-white w-[380px] h-[60px] p-[24px_16px] items-center gap-2 rounded-[40px] bg-[#CBF5CB] hover:bg-[#0D9C36] border-none"
          >
            수정 완료
          </button>
        </form>
      ) : (
        <div className="fixed top-0 md:left-0 w-[320px] md:w-full h-full bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl w-[320px]  md:w-[990px] md:h-[865px] relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-[20px] font-bold border-none"
            >
              X
            </button>
            <h2 className="text-2xl font-semibold mb-4">아나바다 수정</h2>
            <div>
              <label>상품명</label>
              <input
                type="text"
                name="post_title"
                value={editedPost.post_title}
                onChange={handleInputChange}
                className="mt-4 w-full mb-4 p-2 border border-gray-300 rounded-md"
              />
              <label>상품가격</label>
              <input
                type="text"
                name="price"
                value={editedPost.price}
                onChange={handleInputChange}
                className="mt-4 w-full mb-4 p-2 border border-gray-300 rounded-md"
              />
              <label>상품 정보</label>
              <textarea
                name="post_content"
                value={editedPost.post_content}
                onChange={handleInputChange}
                className="mt-4 w-full mb-4 p-2 border border-gray-300 rounded-md"
                rows={5}
              />
              <label>사진</label>
              <div className="relative mb-4 mt-4">
                <div className="w-[160px] h-[160px] mb-2">
                  {/* 기존 이미지 또는 새 이미지 미리보기 */}
                  {newImage ? (
                    <Image
                      src={newImage}
                      alt="사진 미리보기"
                      width={160}
                      height={160}
                      className="object-cover rounded-md w-full h-full"
                    />
                  ) : // 기존 이미지 표시 (기존 이미지는 post_img 배열에 저장되어 있음)
                  editedPost.post_img && editedPost.post_img.length > 0 ? (
                    <Image
                      src={editedPost.post_img[0]} // 첫 번째 이미지를 표시
                      alt="기존 이미지"
                      width={160}
                      height={160}
                      className="object-cover rounded-md w-full h-full"
                    />
                  ) : (
                    <span>사진 없음</span> // 이미지가 없을 때 기본 텍스트 표시
                  )}
                </div>
                <button
                  type="button" // 'submit' 대신 'button' 타입을 명시
                  className="p-2 rounded-full"
                  onClick={() => document.getElementById("imageInput")?.click()}
                >
                  교체하기
                </button>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange} // 이미지가 변경되면 handleImageChange 호출
                />
              </div>
              <label>거래 희망 지역</label>
              <textarea
                name="location"
                value={editedPost.location}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md "
              />
            </div>
            <div className="gap-4 mt-4">
              <button
                type="button"
                onClick={handleSave}
                className="flex justify-center text-center text-white w-[380px] h-[60px] p-[24px_16px] items-center gap-2 rounded-[40px] bg-[#CBF5CB] hover:bg-[#0D9C36] border-none"
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPostModal;
