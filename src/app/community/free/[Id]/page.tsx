"use client";
import { useEffect, useState } from "react";
import { Post } from "@/types/community";
import { communityApi } from "@/api/communityApi";
import { useRouter } from "next/navigation";
import { userStore } from "@/zustand/userStore";
import { useModalStore } from "@/zustand/modalStore";
import { Modal } from "@/components/shared/Modal";
import EditPostModal from "../../components/EditPostModal";
import Like from "../../components/Like";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useLike } from "@/hooks/useLike";

type Comment = {
  comment_id: string;
  user_id?: string; // 댓글 작성자의 user_id
  user_info: {
    user_nickname: string;
  } | null;
  comment_content: string;
  created_at: string;
};

type Props = {
  params: {
    Id: string;
  };
};

const PostDetailPage = ({ params }: Props) => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null); // 수정 중인 댓글 ID
  const [editedComment, setEditedComment] = useState<string>(""); // 수정된 댓글 내용
  const { Id } = params;
  const router = useRouter();
  const { user } = userStore(); // 로그인된 유저 정보
  const { openModal, closeModal } = useModalStore();

  // 게시글 및 댓글을 가져오는 useEffect
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const { data, error } = await communityApi.getPostById(Id);
        if (error) {
          setErrorMessage(error);
          return;
        }
        if (data) {
          setPost(data);
        }

        // 댓글을 가져올 때, undefined가 아니도록 처리
        const { data: commentData, error: commentError } =
          await communityApi.getCommentsByPostId(Id);
        if (commentError) {
          setErrorMessage(commentError);
          return;
        }
        console.log("comment data =>", commentData);
        setComments(commentData || []);
      } catch (error) {
        setErrorMessage("게시글을 불러오는 데 오류가 발생했습니다.");
        console.log("error", error);
      }
    };

    fetchPostAndComments();
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

  const canEdit = user.isAuthenticated && post.user_id === user.id;

  // 댓글 추가 처리
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // 댓글이 비어있지 않도록 확인

    const { data, error } = await communityApi.addComment(
      post.post_id,
      user.id,
      newComment
    );
    console.log("data=>", data);

    if (error) {
      alert("댓글을 추가하는 데 오류가 발생했습니다.");
    } else {
      setComments((prev) => [data, ...prev]); // 새로운 댓글 추가

      setNewComment(""); // 입력 필드 초기화
    }
  };

  // 댓글 삭제 처리
  const handleDeleteComment = async (commentId: string) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("정말 삭제 하시겠습니까?");
      if (confirmed) {
        const { error } = await communityApi.deleteComment(commentId);
        if (error) {
          alert("댓글 삭제에 실패했습니다.");
        } else {
          setComments((prev) =>
            prev.filter((comment) => comment.comment_id !== commentId)
          ); // 댓글 삭제 후 상태 업데이트
        }
      }
    }
  };

  // 댓글 수정 처리
  const handleEditComment = (commentId: string) => {
    const commentToEdit = comments.find(
      (comment) => comment.comment_id === commentId
    );
    if (commentToEdit) {
      setEditingCommentId(commentId); // 수정할 댓글 ID 저장
      setEditedComment(commentToEdit.comment_content); // 수정할 댓글 내용 저장
    }
  };

  // 댓글 수정 완료 처리
  const handleSaveEditedComment = async () => {
    if (!editedComment.trim()) return; // 수정된 댓글 내용이 비어있지 않도록 확인

    const { error } = await communityApi.updateComment(
      editingCommentId!,
      editedComment
    );
    if (error) {
      alert("댓글 수정에 실패했습니다.");
    } else {
      setComments((prev) =>
        prev.map((comment) =>
          comment.comment_id === editingCommentId
            ? { ...comment, comment_content: editedComment }
            : comment
        )
      );
      setEditingCommentId(null); // 수정 모드 종료
      setEditedComment(""); // 수정된 내용 초기화
    }
  };

  // 게시글 수정 처리
  const handleEditClick = () => {
    if (post) {
      openModal({
        type: "custom",
        content: (
          <EditPostModal
            type="free"
            post={post}
            onClose={closeModal}
            onSave={(updatedPost) => {
              handleSavePost(updatedPost);
              closeModal();
            }}
          />
        )
      });
    }
  };

  const handleSavePost = async (editedPost: Post | null) => {
    if (!editedPost) return;

    try {
      const { error } = await communityApi.update(editedPost);
      if (error) {
        throw error;
      }
      setPost(editedPost); // 수정된 게시글 상태 업데이트
      console.log("게시글 수정 성공:", editedPost);
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDeletePost = async (post: Post) => {
    if (typeof window !== "undefined") {
      // 클라이언트에서만 실행되도록 확인
      const confirmed = window.confirm("정말 삭제 하시겠습니까?");
      if (confirmed) {
        try {
          const { error } = await communityApi.delete(post);
          if (error) {
            throw error;
          }
          alert("게시글이 삭제되었습니다.");
          router.push("/community/free");
        } catch (error) {
          console.error("게시글 삭제 실패:", error);
          alert("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
        }
      }
    }
  };

  return (
    <div className="min-w-[320px] md:pt-[64px] p-2 md:mt-0 mt-6 mx-auto w-full md:max-w-[1200px] px-[20px] md:px-0 pb-[80px] md:pb-0">
      <Link
        href={"/community/free"}
        className="flex items-center md:mb-4 md:mt-4 text-[#525660] text-[16px] font-[600] leading-[22.4px] tracking-[-0.16px]"
      >
        <ChevronLeft />
        자유게시판
      </Link>
      <div className="md:mb-[36px] mt-[16px] mb-[36px] w-full md:mt-4 h-px bg-[#D5D7DD]"></div>
      <article>
        <label className="font-[700] text-[22px] md:text-2xl md:font-semibold">
          {post.post_title}
        </label>
        <div className="leading-[1] flex items-center gap-[4px] mt-[20px] text-[#A1A7B4] text-[16px]">
          <label className="">{post.user_info.user_nickname}</label>
          <span>·</span>
          <label>{new Date(post.created_at).toLocaleDateString()}</label>
          <span>·</span>
          <div className="flex gap-[4px] text-[#A1A7B4">
            <Like postId={post.post_id} />
            <span>{likes.length}</span>
          </div>
        </div>
        <p className="md:mt-[] md:leading-normal mt-[36px] text-[#000301] text-[14px] font-[400]">
          {post.post_content}
        </p>

        {post.post_img &&
        Array.isArray(post.post_img) &&
        post.post_img.length > 0 ? (
          <div>
            <div className="flex mt-6 md:mt-[36px] md:mb-[68px] gap-4">
              {post.post_img.map((img, index) => (
                <div key={index} className="max-w-[168px] max-h-[168px]">
                  <Image
                    src={img}
                    alt={`게시글 이미지 ${index + 1}`}
                    width={168}
                    height={168}
                    className="w-full h-full object-cover p-2 md:p-0 rounded-[12px]"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          post.post_img &&
          typeof post.post_img === "string" &&
          post.post_img !== "" && (
            <div className="max-w-[168px]">
              <Image
                src={post.post_img}
                alt="게시글 이미지"
                width={168}
                height={168}
                className="w-full h-full object-cover"
              />
            </div>
          )
        )}
      </article>

      {/* 댓글 입력 부분 */}
      <div className="relative flex mt-[68px] md:mt-[36px] mb-[32px] w-full">
        <div className="w-full py-[28px] px-[32px] flex flex-row bg-[#E8F3E8] justify-between items-center rounded-[12px]">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력해주세요"
            className=" w-full outline-none  border-transparent bg-[#E8F3E8] md:px-4 border-none text-[#A1A7B4] leading-[21px] overflow-hidden resize-none"
          />
          <button
            onClick={handleAddComment}
            className="py-[12px] px-[16px] whitespace-nowrap bg-[#0D9C36] border-none rounded-full text-white text-[16px] font-[500] leading-[24px] tracking-[-0.16px] "
          >
            댓글 등록
          </button>
        </div>
      </div>
      <hr className="h-px md:mt-[20px] w-full"></hr>
      {/* 댓글 목록 */}
      <div className="md:mt-0 flex flex-col pt-[28px]">
        {comments.map((comment) => (
          <div key={comment.comment_id} className="flex flex-col md:mb-4">
            <div className="flex items-center text-[#A1A7B4] text-[14px] leading-[21px] tracking-[-0.14px] gap-[4px]">
              <span className="font-[500] md:font-[600]">
                {comment.user_info?.user_nickname}
              </span>
              <span className="text-[10px]">&#8226;</span>
              <span className="md:text-[12px] text-[#A1A7B4]">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            {editingCommentId === comment.comment_id ? (
              <div className="w-full py-[28px] px-[32px] flex flex-row bg-[#F5F5F5] justify-between items-center rounded-[12px]">
                <textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className="w-full outline-none border-transparent bg-[#F5F5F5] md:px-4 border-none text-[#A1A7B4] leading-[21px] resize-none overflow-hidden " // 우측 여백을 충분히 확보
                />
                <button
                  onClick={handleSaveEditedComment}
                  className=" py-[12px] px-[16px] whitespace-nowrap bg-[#D5D7DD] border-none rounded-full text-white text-[16px] font-[500] leading-[24px] tracking-[-0.16px]"
                >
                  수정완료
                </button>
              </div>
            ) : (
              <p className="text-[#000301] md:mt-2 mt-[20px] text-[14px] font-[400] leading-[21px] tracking-[-0.42px]">
                {comment.comment_content}
              </p>
            )}

            {user.id === comment.user_id && !editingCommentId && (
              <div className="flex space-x-4 mt-[20px] md:mt-2">
                <button
                  onClick={() => handleEditComment(comment.comment_id)}
                  className="text-[13px] border-none"
                >
                  수정하기
                </button>
                <button
                  onClick={() => handleDeleteComment(comment.comment_id)}
                  className="text-[13px] border-none"
                >
                  삭제하기
                </button>
              </div>
            )}
            <hr className="h-px mt-[28px] md:mt-[20px] w-full"></hr>
          </div>
        ))}
      </div>
      <div>
        {canEdit && (
          <div className="md:flex md:flex-row gap-[12px] justify-end mt-[10px] md:mt-[20px] md:mb-[198px] w-full">
            <button
              onClick={handleEditClick}
              className="w-[80px] h-[32px] rounded text-[14px]"
            >
              수정하기
            </button>
            <button
              onClick={() => handleDeletePost(post)}
              className="w-[80px] h-[32px] rounded text-[14px]"
            >
              삭제하기
            </button>
          </div>
        )}
      </div>

      <Modal />
    </div>
  );
};

export default PostDetailPage;
