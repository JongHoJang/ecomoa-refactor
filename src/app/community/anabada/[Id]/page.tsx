"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { communityApi } from "@/api/communityApi";
import { Post } from "@/types/community";
import { userStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";
import EditPostModal from "../../components/EditPostModal";
import { useModalStore } from "@/zustand/modalStore";
import { Modal } from "@/components/shared/Modal";
import Like from "../../components/Like";
import { ChevronLeft } from "lucide-react";
import { useLike } from "@/hooks/useLike";

const Page = ({ params }: { params: { Id: string } }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { openModal, closeModal } = useModalStore();
  const { Id } = params;
  const router = useRouter();

  const { user } = userStore();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await communityApi.getPostById(Id);
        if (error) {
          setErrorMessage(error);
          return;
        }

        if (data) {
          setPost(data); // post 상태 업데이트
        } else {
          setErrorMessage("게시글이 없습니다.");
        }
      } catch (error) {
        setErrorMessage("게시글을 불러오는 데 오류가 발생했습니다.");
        console.log("error", error);
      }
    };

    fetchPost();
  }, [Id]);

  const { likes } = useLike(Id);

  if (errorMessage) {
    return (
      <div className="text-center mt-10">
        <p>{errorMessage}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center mt-10">
        <p>게시글을 불러오는 중입니다...</p>
      </div>
    );
  }

  const images = post.post_img ?? [];

  const canEdit = user.isAuthenticated && post.user_id === user.id;

  // 수정 버튼 클릭 시 모달 열기
  const handleEditClick = () => {
    if (post) {
      openModal({
        type: "custom",
        content: (
          <EditPostModal
            type="anabada"
            onClose={closeModal}
            post={post}
            onSave={(updatedPost) => {
              handleSavePost(updatedPost);
              closeModal();
            }}
          />
        )
      });
    }
  };

  // 수정된 게시글 저장
  const handleSavePost = async (editedPost: Post) => {
    try {
      // 게시글 정보를 업데이트
      const { error } = await communityApi.update(editedPost);

      if (error) {
        throw error;
      }

      // 상태 업데이트 및 모달 닫기
      setPost(editedPost);
      console.log("게시글 수정 성공:", editedPost);
    } catch (error) {
      // 오류 처리
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDeletePost = async (post: Post) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("정말 삭제 하시겠습니까?");
      console.log("컨펌", confirmed);
      if (confirmed) {
        try {
          const { error } = await communityApi.delete(post);
          if (error) {
            throw error;
          }
          alert("게시글이 삭제 되었습니다.");
          router.push("/community/anabada");
        } catch (error) {
          console.error("게시글 삭제 실패:", error);
          alert("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
        }
      }
    }
  };

  return (
    <main className="w-full md:w-[1200px] mx-auto p-[36px_20px_0px_20px] md:p-0 md:pb-[198px]">
      <Link href="/community/anabada">
        <h3 className="flex items-center text-[16px] font-[600] md:mt-[65px] text-[#525660]">
          <ChevronLeft />
          아나바다 시장
        </h3>
      </Link>

      <div className="mb-[20px] md:mb-[36px] w-full md:w-[1200px] h-px bg-[#D5D7DD] mt-[16px] md:mt-[16px]"></div>
      <article className="flex flex-col md:flex-row w-full mx-auto md:w-[1200px]">
        {images.length > 0 ? (
          <div className="md:w-[585px] md:h-[585px] w-full h-[320px]">
            <Image
              src={images[0]}
              alt="게시글 이미지"
              width={585}
              height={585}
              priority
              className="object-cover w-full h-full rounded-[6px]"
            />
          </div>
        ) : (
          // 이미지가 없으면 회색 배경을 사용
          <div
            className="bg-gray-300 md:h-[585px] w-full h-[320px] md:w-[585px] flex items-center justify-center"
            style={{ backgroundColor: "#D5D7DD" }}
          >
            <Image
              src={"/images/default_img.svg"}
              alt={`default_img`}
              width={160}
              height={160}
              className="w-full h-full rounded-[12px]"
            />{" "}
          </div>
        )}

        <div className="flex flex-col md:ml-[30px] w-full md:w-[585px] gap-3 md:mt-4 mt-[40px]">
          <label className="text-[22px] mb-2 md:mb-[24px] text-[#000301]">
            {post.post_title}
          </label>
          <label className="text-[30px] font-[700] mt-[24px] md:mt-0">
            {post.price}원
          </label>
          <div className="leading-[1] flex gap-[4px] text-[16px] font-[500] text-[#A1A7B4] mt-[24px]">
            <label>{post.user_info?.user_nickname}</label>
            <span>·</span>
            <time>{new Date(post.created_at).toLocaleDateString()}</time>
            <span>·</span>
            <div>
              <Like postId={post.post_id} />
            </div>
            <span>{likes.length}</span>
            {/* <div className="ml-2">댓글 {post.comment || 0}</div> */}
          </div>
          <div className="mb-[36px] md:my-[36px] mt-4 w-full md:w-[585px] h-px bg-[#D5D7DD]"></div>
          <div className="w-[330px] md:w-[585px] flex flex-col h-full">
            <p className="text-[14px] text-[#0D9C36] font-[600] mb-4">
              상품정보
            </p>
            <p className="text-[14px] font-[400] mb-[40px] md:mb-[40px]">
              {post.post_content}
            </p>
            <label className="text-[14px] font-[600] text-[#0D9C36] mb-4 md:mb-0">
              거래 희망 지역
            </label>
            <label className="-ml-[5px] flex gap-[4px] justify-center items-center md:mt-4 mb-[48px] md:mb-2 rounded-[32px] border w-[100px] border-[#D5D7DD] p-[15px_16px] md:p-2">
              <Image
                src={"/images/region.png"}
                width={12}
                height={15}
                alt="거래 희망 지역"
              />
              {post.location ? post.location : "없음"}
            </label>

            <button
              onClick={() => {
                alert("업데이트 예정입니다.");
              }}
              className="text-[18px] bg-[#0D9C36] text-white font-[400] md:font-[600] rounded-[40px] mt-auto flex justify-center items-center gap-[10px] md:w-[380px] md:h-[60px] w-[151px] h-[60px]"
            >
              채팅보기
            </button>
            {/* <button>거래 완료</button> */}
          </div>
        </div>
      </article>
      <div className="mb-[80px] md:mb-0">
        {canEdit && (
          <div className="flex flex-col justify-end text-[#000301]">
            <div className="mb-[20px] md:w-[1200px] h-px bg-[#D5D7DD] mt-[28px] md:mt-[36px] w-full"></div>
            <div className="ml-auto flex gap-[12px]">
              <button
                onClick={handleEditClick}
                className="flex justify-center items-center w-[80px] h-[32px] rounded text-[13px] px-[13px] py-[15px]"
              >
                수정하기
              </button>

              <button
                onClick={() => handleDeletePost(post)}
                className="flex justify-center items-center w-[80px] h-[32px] rounded text-[13px] px-[13px] py-[15px]"
              >
                삭제하기
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal />
    </main>
  );
};

export default Page;
