import { getUser } from "@/api/auth-actions";
import {
  checkNicknameAvailability,
  getUserInfo,
  updateNickname
} from "@/api/user-action";
import { UserInfoNickname } from "@/types/userInfoType";
import { useModalStore } from "@/zustand/modalStore";
import { userStore } from "@/zustand/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Filter from "badwords-ko";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const filter = new Filter();

interface FormData {
  nickname: string;
}
const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(1, { message: "닉네임은 최소 1자 이상이어야 합니다." })
    .max(20, { message: "닉네임은 20자 이하이어야 합니다." })
    .regex(/^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ@_-]*$/, {
      message: "이모지, 공백, 특수문자(-,_제외)를 사용할 수 없습니다"
    })
    .refine(
      async (nickname: string) => {
        const user = await getUser();
        // const { user } = userStore();
        if (!user) return false;
        const available = await checkNicknameAvailability(nickname, user.id);
        return available;
      },
      {
        message: "이미 사용 중인 닉네임입니다."
      }
    )
    .refine(
      (nickname: string) => {
        // 욕설이 없으면 true 반환
        const isProfane = filter.isProfane(nickname);
        return !isProfane;
      },
      {
        message: "닉네임에 금지된 단어가 포함되어 있습니다."
      }
    )
});

export const useNickname = () => {
  const { openModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = userStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(nicknameSchema)
  });
  const nicknameValue = watch("nickname") || ""; // 현재 닉네임 값
  const inputLength = nicknameValue?.length || 0;

  // 닉네임 업데이트
  const { mutateAsync } = useMutation<
    UserInfoNickname | null,
    Error,
    { userId: string; newNickname: string }
  >({
    mutationFn: updateNickname,
    onSuccess: async () => {
      await getUserInfo(user.id);

      queryClient.invalidateQueries({
        queryKey: ["userInfo", user.id]
      });
    },
    onError: (error) => {
      console.error("닉네임 업데이트 오류", error);
    }
  });
  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({ userId: user.id, newNickname: data.nickname });
      setIsSuccess(true);
      closeModal();
      if (errors.nickname) {
        console.error("닉네임 유효성 검사 오류:", errors.nickname.message);
      }

      // 성공 모달은 여기서 열기
      openModal(
        <div className="z-0 flex items-center">
          <form className="z-1 overflow-y-hidden w-[585px] rounded-[20px] flex flex-col justify-center items-center mx-auto bg-white">
            <div
              className="flex items-center relative w-[585px] h-[341px] mb-6"
              style={{ backgroundColor: "#CBF5CB", height: "341px" }}
            >
              <X
                onClick={onClickClose}
                className="z-2 border-none absolute top-7 right-7 cursor-pointer text-white"
              />
              <Image
                src="/images/modalImage.png"
                width={392}
                height={204}
                alt="modalImage"
                className="mx-auto mt-[73px]"
              />
            </div>

            <div className="flex flex-col justify-center items-center h-[249px]">
              <div className="font-wanted text-[24px] font-[600] leading-[36px] text-center w-[540px] h-[71px] mb-[27px]">
                <div className="text-[24px] font-[600] leading-[36px]">
                  <p className="mt-[15px] mb-[32px]">
                    <span className="text-[#0D9C36]">{data.nickname}</span> 님의
                    모아가 생성되었습니다.
                    <br />
                    포인트를 모아 다음 레벨로 성장시켜주세요!
                  </p>
                </div>
              </div>
              <div style={{ marginBottom: "33px" }}>
                <p className="text-[#525660] text-center font-wanted text-[16px] font-[500] leading-[24px]">
                  데일리 챌린지를 하고 인증 글을 올리면 포인트를 Get
                </p>
              </div>
              {/* <Image src={"/seed.png"} width={150} height={150} alt="seed" /> */}
              <button
                onClick={onClickChallenge}
                className="flex items-center justify-center w-[380px] h-[60px] p-[11px_32px] mb-[32px] text-[#FFFFFF] font-wanted font-[600] text-[18px] rounded-[40px] bg-[#0D9C36] border-none"
              >
                데일리 챌린지 하러 가기
              </button>
            </div>
          </form>
        </div>,
        "",
        0
      );
    } catch (error) {
      console.error("닉네임 설정 오류:", error);
    }
  };
  const onClickChallenge = () => {
    closeModal();
    router.push("/challenge");
  };

  const onClickClose = () => {
    closeModal();
    router.push("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue("nickname", value);
  };

  return {
    onSubmit,
    onClickClose,
    handleChange,
    register,
    inputLength,
    errors,
    handleSubmit,
    isSuccess,
    onClickChallenge
  };
};
