"use client";

import { Modal } from "@/components/shared/Modal";
import { useNickname } from "@/hooks/useNickname";
import { useUserInfo } from "@/hooks/useUserInfo";
import { createClient } from "@/utlis/supabase/client";
import { useModalStore } from "@/zustand/modalStore";
import { userStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CircleX } from "lucide-react";
import { CircleCheck } from "lucide-react";

const AuthCallback = () => {
  const router = useRouter();
  const supabase = createClient();
  const { data: userInfo } = useUserInfo();
  const { loginUser } = userStore();
  const { openModal } = useModalStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    "이모지, 공백, 특수문자(-,_제외)를 사용할 수 없습니다."
  );

  const {
    onSubmit,
    handleSubmit,
    handleChange,
    register,
    errors,
    inputLength
  } = useNickname();

  useEffect(() => {
    if (errors.nickname) {
      setErrorMessage(errors.nickname?.message ?? null);
    }
  }, [errors.nickname]);

  useEffect(() => {
    const handleAuth = async () => {
      // 소셜 로그인, 이메일 로그인 상관 없이 이 페이지를 거치면
      // getSession을 통해서 로그인 유저의 정보를 가져와서 Zustand의 전역 상태를 업데이트함
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          loginUser({
            email: session.user.email as string,
            accessToken: session.access_token as string,
            id: session.user.id as string,
            isAuthenticated: true
          });

          setIsAuthenticated(true);
          // => 로그인이 성공적으로 완료 된 상태일 때 true로 설정해서 후에 닉네임 설정 모달창 오픈에 관여함
        }
      } catch (error) {
        console.error("로그인 에러:", error);
        router.push("/login");
      }
    };

    handleAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated && userInfo) {
      //먼저 로그인된 상태인지 확인함
      // 로그인 중이라면 firstTag(닉네임 설정 여부)가 false일 때 닉네임 설정 모달창 오픈
      if (userInfo?.params?.firstTag === false) {
        openModal({
          type: "custom",
          content: (
            <form
              onSubmit={handleSubmit(onSubmit)}
              // => 이 handleSubmit이 실행될 때 다음 모달창이 열리도록 설정해놨기 때문에 useNickName로직 확인 해야함
              className="flex-col-center overflow-hidden w-[320px] md:w-[585px] h-[360px] rounded-[16px] mx-auto bg-white"
            >
              {/* <div className="relative w-full h-full -pt-[100px]">
                <X
                  onClick={onClickClose}
                  className="border-none absolute top-7 right-7 cursor-pointer"
                />
              </div> */}
              <div className="text-[20px] md:text-[24px] font-[600] leading-[36px] mt-[64px]">
                <p className="text-center">만나서 반갑습니다.</p>
                <p>
                  <span className="text-[#0D9C36]">닉네임</span>을 설정해주세요!
                </p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="nickname"
                  className="outline-none px-[20px] md:px-[20px] w-[256px] md:w-[400px] h-[56px] leading-[16.8px] tracking-[-0.12px] p-[0px_20px] rounded-[12px] border-none bg-[#F3F3F3] mb-[74px] placeholder:text-[20px] placeholder:leading-[30px] flex justify-between items-center mt-[32px]"
                  {...register("nickname")}
                  maxLength={6}
                  placeholder="ex. 홍길동"
                  onChange={handleChange}
                />
                {/* 글자 수 표시 */}
                <span className="text-[#6E7481] absolute top-[3.5rem] right-3 text-[16px]">
                  {inputLength}/6
                </span>
                {/* 에러 메세지 or 성공 메세지 */}
                <p
                  role="alert"
                  className={`absolute top-24 left-1 text-[12px] md:text-[14px] z-50 ${
                    errors.nickname
                      ? "text-red-600" // 에러 상태일 때 빨간색
                      : inputLength > 0 && !errors.nickname
                      ? "text-blue-600" // 성공 상태일 때 파란색
                      : "text-[#525660]" // 기본 상태일 때 회색
                  }`}
                >
                  {errors.nickname ? (
                    <div className="flex items-center leading-[21px] justify-center font-[500]">
                      <CircleX
                        className="text-[#FF361B] mr-1 w-5 h-5"
                        stroke="#FFF"
                        fill="#FF361B"
                      />
                      {errors.nickname.message}
                    </div>
                  ) : inputLength > 0 ? (
                    <div className="flex items-center leading-[21px] justify-center font-[500]">
                      <CircleCheck
                        className="text-[#179BFF] mr-1 w-5 h-5"
                        stroke="#FFF"
                        fill="#179BFF"
                      />
                      사용 가능한 닉네임 입니다
                    </div>
                  ) : (
                    "이모지,특수문자(-,_제외)를 사용할 수 없습니다"
                  )}
                </p>
              </div>
              <div className="flex-col-center rounded-[40px]">
                <button
                  type="submit"
                  className="mb-[32px] -mt-[15px] text-[#FFFFFF] font-[600] text-[18px] w-[256px] md:w-[380px] h-[60px] p-[11px_32px] rounded-[40px] bg-[#0D9C36] border-none"
                >
                  설정하기
                </button>
              </div>
            </form>
          )
        });
      } else {
        router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, isAuthenticated, inputLength, errorMessage]);

  return (
    <div>
      {/* 스켈레톤 UI (로딩처리) */}
      {/* <div className="w-[1200px] mx-auto mt-[50px] ">
        <section className="mb-[280px] h-[533px] mx-auto flex justify-center">
          <div className="w-[1800px] bg-gray-200 animate-pulse rounded-3xl" />
        </section>
        <section className="flex flex-col items-center justify-center gap-[80px] mb-[280px]">
          <div className="w-[327px] h-[63.33px] bg-gray-200 animate-pulse rounded-md" />
          <div className="flex flex-col gap-4 items-center">
            <div className="h-[36px] w-[700px] bg-gray-200 animate-pulse rounded-md" />
            <div className="h-[36px] w-[500px] bg-gray-200 animate-pulse rounded-md" />
            <div className="h-[36px] w-[600px] bg-gray-200 animate-pulse rounded-md" />
          </div>
        </section>
      </div> */}

      {/* 모달 */}
      <Modal />
    </div>
  );
};

export default AuthCallback;
