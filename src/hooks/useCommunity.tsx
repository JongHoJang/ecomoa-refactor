"use client";
import { communityApi } from "@/api/communityApi";
import { getUserInfo } from "@/api/user-action";
import { UserInfo } from "@/types/userInfoType";
import { createClient } from "@/utlis/supabase/client";
import { useModalStore } from "@/zustand/modalStore";
import { userStore } from "@/zustand/userStore";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL과 ANON KEY는 .env.local에 정의되어야 합니다.");
}

const supabase = createClient();

export const useCommunity = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    Array(3).fill("")
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [location, setLocation] = useState(""); // 지역명 상태 추가
  const [price, setPrice] = useState<number>(0); // 가격 상태 추가
  const router = useRouter();
  const { user } = userStore();
  const { openModal, closeModal } = useModalStore();
  useEffect(() => {
    const fetch = async () => {
      const res = await getUserInfo(user.id);
      setUserInfo(res);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const selectedImage = event.target.files?.[0];
    if (selectedImage) {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = URL.createObjectURL(selectedImage);
      setImagePreviews(newPreviews);

      const newImages = [...images];
      newImages[index] = selectedImage;
      setImages(newImages);
    }
  };

  const handleImageClick = (index: number) => {
    if (index >= 3) {
      return; // 최대 3개까지만 이미지 선택
    }
    fileInputRef.current?.setAttribute("data-index", index.toString());
    fileInputRef.current?.click();
  };
  const resetForm = () => {
    setTitle("");
    setContent("");
    setImages(Array(3).fill(null));
    setImagePreviews(Array(3).fill(""));
    setUploadedImageUrls([]);
    setErrorMessage("");
    setPrice(0);
    setLocation("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    type: string
  ) => {
    event.preventDefault();
    if (!user) {
      setErrorMessage("사용자가 인증되지 않았습니다.");
      return;
    }

    // openModal({
    //   type: "custom",
    //   content: (
    //     <div className="bg-white p-6 rounded-lg shadow-lg text-center relative w-[585px] h-[600px]">
    //       <button
    //         onClick={handleCloseModal}
    //         className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 border-none text-3xl"
    //       >
    //         &times; {/* X 아이콘 */}
    //       </button>
    //       <div className="p-12">
    //         <h4 className="font-semibold mb-4 text-2xl">
    //           게시글을 업로드 중이에요
    //         </h4>
    //         <div>이미지 업로드 및 게시글 작성 중...</div>
    //       </div>
    //     </div>
    //   )
    // });

    const uploadedUrls: string[] = [];

    for (const image of images) {
      if (image) {
        const sanitizedFileName = image.name
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9._-]/g, "");

        const uniqueFileName = `public/${Date.now()}_${sanitizedFileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("posts")
          .upload(uniqueFileName, image);

        if (uploadError) {
          console.error("업로드 실패:", uploadError.message);
          setErrorMessage("이미지 업로드에 실패했습니다.");
          return;
        }

        const imageUrl = `https://${
          supabaseUrl.split("/")[2]
        }/storage/v1/object/public/posts/${uploadData.path}`;
        uploadedUrls.push(imageUrl);
      }
    }
    //imageUpload 할 때 아래처럼 해야함
    const formattedUrls = `{${uploadedUrls
      .map((url) => `"${url}"`)
      .join(",")}}`;
    //imageUpload 할 때 아래처럼 해야함
    //글 작성이 완료되면 커뮤니티 메인페이지로 라우팅처리 (useRouter 사용하기)
    try {
      const getData = await communityApi.create({
        user_id: user.id,
        title,
        content,
        formattedUrls,
        price,
        location,
        type
      });
      openModal({
        type: "custom",
        content: (
          <div className="bg-white  rounded-lg shadow-lg text-center relative md:w-[585px] md:h-[600px]w-[320px] h-[609px]">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 border-none text-3xl"
            >
              &times; {/* X 아이콘 */}
            </button>
            <div className="w-[320px] h-[609px] md:w-[585px] md:h-[600px]">
              <Image
                src={"/community/upload.png"}
                alt="등록한 이미지"
                width={585}
                height={300}
                className="mb-4 max-w-full rounded"
              />
              <div className="p-6">
                <h4 className="font-semibold mb-4 text-2xl">
                  게시글을 업로드 했어요
                </h4>
                <div className="flex h-[32px] py-[15px] px-[8px] justify-center items-center gap-[10px] rounded-[4px] bg-[#EDEEF0] w-[275px] ">
                  <h4 className="text-[#00691E] text-center text-[12px] md:text-[14px] font-medium tracking-[-0.14px] leading-normal ">
                    위치
                  </h4>
                  <h3 className="text-[#000301] text-center text-[12px] md:text-[14px] font-normal tracking-[-0.14px] leading-normal">
                    {type === "free"
                      ? "마이페이지 > 나의 게시글 > 자유게시판 "
                      : "마이페이지 > 나의 게시글 > 아나바다 시장 "}
                  </h3>
                </div>
                <div className="my-6" style={{ margin: 20 }}>
                  <Link
                    href={
                      type === "free"
                        ? `/community/free/${getData.post_id}`
                        : `/community/anabada/${getData.post_id}`
                    }
                    className="flex w-[248px] h-[60px] text-[16px] md:w-[513px] md:h-[60px] p-[24px_16px] justify-center items-center gap-[10px] flex-shrink-0 rounded-[40px] text-white bg-[#0D9C36] md:text-[18px] font-semibold leading-normal tracking-[-0.18px] "
                    onClick={closeModal}
                  >
                    업로드한 게시글 보러가기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      });
      resetForm();
    } catch (error) {
      console.error("게시글 작성 에러", error);
    }
  };

  const handleCloseModal = () => {
    router.push("/community/anabada");
    closeModal();
    setUploadedImageUrls([]);
  };

  return {
    setTitle,
    userInfo,
    errorMessage,
    handleSubmit,
    title,
    content,
    fileInputRef,
    handleImageClick,
    imagePreviews,
    uploadedImageUrls,
    setContent,
    handleImageChange,
    location,
    setLocation,
    price,
    setPrice
  };
};
