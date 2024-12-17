"use client";

import { Challenge } from "@/types/community";
import Image from "next/image";
import { useEffect, useState } from "react";

const ChallengeModal = ({
  challenge,
  onSave,
  onClose
}: {
  challenge: Challenge;
  onClose: () => void;
  onSave: (challenge: Challenge) => void;
}) => {
  const [updatedChallenge, setUpdatedChallenge] = useState(challenge);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // 클라이언트 여부 체크

  // 클라이언트에서만 실행하도록 useEffect 사용
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 게시글 내용이 변경될 때 상태 업데이트
  useEffect(() => {
    setUpdatedChallenge(challenge);
    // 기존 이미지 미리보기 설정
    setImagePreview(challenge.image_urls ? challenge.image_urls[0] : null);
  }, [challenge]);

  // 이미지 변경 시 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 저장 버튼 클릭 시 호출되는 함수
  const handleSave = async () => {
    const formData = new FormData();
    if (newImage) {
      formData.append("image_urls", newImage);
    }
    formData.append("content", updatedChallenge.content);
    formData.append("image_urls", String(updatedChallenge.image_urls));
    formData.append("selceted_options", updatedChallenge.selected_options);

    try {
      // 서버에 업데이트 요청 (API endpoint로 변경 가능)
      await fetch("/api/updatePost", {
        method: "POST",
        body: formData
      });
      onSave(updatedChallenge);
    } catch (error) {
      console.error("사진 업로드 및 수정 실패:", error);
    }
  };

  // 클라이언트에서만 실행하도록
  const handleFileInputClick = () => {
    if (isClient) {
      document.getElementById("imageInput")?.click();
    }
  };

  return (
    <>
      <form className="w-[965px] h-[500px]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold border-none"
        >
          X
        </button>
        <div>
          <h3 className="font-bold text-[14px] mb-2"></h3>
          <div className="flex flex-wrap gap-2"></div>

          <label>사진</label>
          <div className="relative mb-4 mt-4">
            {imagePreview ? (
              <div className="w-[160px] h-[160px] mb-2">
                <Image
                  src={imagePreview}
                  alt="사진 미리보기"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-[160px] h-[160px] bg-gray-200 mb-2 flex justify-center items-center">
                <p>사진 없음</p>
              </div>
            )}
            <button
              type="button"
              className="p-2 rounded-full"
              onClick={handleFileInputClick} // 클라이언트에서만 실행되도록
            >
              교체하기
            </button>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <button type="button" onClick={handleSave}>
          수정하기
        </button>
      </form>
    </>
  );
};
export default ChallengeModal;
