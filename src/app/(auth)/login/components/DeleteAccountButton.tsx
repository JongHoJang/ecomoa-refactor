"use client";

import { deleteUserInfo } from "@/api/auth-actions";
import { deleteUser } from "@/api/delete-action";
import { userStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";

interface DeleteAccountProps {
  userId: string;
}

const DeleteAccountButton = ({ userId }: DeleteAccountProps) => {
  const router = useRouter();
  const { logoutUser } = userStore();
  const handleDeleteAccount = async () => {
    try {
      const isConfirmed = window.confirm("회원 탈퇴하시겠습니까?");
      if (isConfirmed) {
        logoutUser();
        await deleteUser(userId);
        await deleteUserInfo(userId);
        router.push("/login");
      }
    } catch (error) {
      alert("회원 탈퇴에 실패했습니다.");
      console.error(error);
    }
  };

  return (
    // className="text-[#000301] font-wanted text-[18px] font-[500] leading-normal tracking-[-0.18px]

    <button
      className="border-none text-[#000301] font-wanted text-[18px] font-[500] leading-normal tracking-[-0.18px]"
      onClick={handleDeleteAccount}
    >
      회원 탈퇴
    </button>
  );
};

export default DeleteAccountButton;
