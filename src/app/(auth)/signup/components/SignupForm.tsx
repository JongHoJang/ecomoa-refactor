"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signup } from "@/api/auth-actions";
import { SignupInput } from "@/types/authType";
import { CircleAlert, CircleCheck } from "lucide-react";
import { checkEmailAbility } from "@/api/user-action";
import { useEffect, useState } from "react";
import AutoWidthButton from "@/components/shared/AutoWidthButton";

// Zod 스키마 정의
const signupSchema = z
  .object({
    email: z.string().email({ message: "유효한 이메일을 입력해주세요." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 최대 20자 이하여야 합니다." })
      .regex(/[A-Za-z]/, { message: "영문자를 최소 1자 이상 포함해야 합니다." })
      .regex(/\d/, { message: "숫자를 최소 1자 이상 포함해야 합니다." })
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, {
        message: "특수문자를 최소 1자 이상 포함해야 합니다."
      })
      .nonempty({ message: "비밀번호를 입력해주세요." }),
    passwordConfirm: z
      .string()
      .nonempty({ message: "비밀번호가 일치하지 않습니다." })
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"]
  });

const SignupForm = () => {
  const router = useRouter();
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string | null>(
    null
  ); // 이메일 성공 메시지 추가
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null); // 비밀번호 성공 메시지 추가
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState<
    string | null
  >(null); // 추가
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    clearErrors, // clearErrors 추가
    formState: { errors }
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema)
  });

  const password = watch("password");

  useEffect(() => {
    if (password && password.length >= 8 && !errors.password) {
      setPasswordMessage("사용 가능한 비밀번호입니다.");
    } else {
      setPasswordMessage(null);
    }
  }, [password, errors.password]);

  // 이메일 중복 검사(성공 메세지 추가)
  const handleEmailBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const email = event.target.value;
    if (email) {
      try {
        const available = await checkEmailAbility(email);
        if (!available) {
          setError("email", {
            type: "manual",
            message: "이미 존재하는 이메일입니다."
          });
          setIsEmailValid(false);
        } else {
          // 이메일 중복이 아니면 오류를 지운다
          clearErrors("email");
          setIsEmailValid(true);
          setEmailSuccessMessage("사용 가능한 이메일입니다.");
        }
      } catch (error) {
        console.error("이메일 중복 체크 오류:", error);
      }
    }
  };

  // const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const password = event.target.value;
  //   setValue("password", password);

  //   try {
  //     signupSchema.parse(password); // Zod 스키마로 즉시 검증
  //     setPasswordMessage("사용 가능한 비밀번호입니다."); // 검증 성공
  //     clearErrors("password");
  //   } catch (error) {
  //     setPasswordMessage(null); // 성공 메시지 초기화
  //     if (error instanceof z.ZodError) {
  //       setError("password", { message: error.errors[0]?.message }); // 첫 번째 오류 메시지 설정
  //     }
  //   }
  // };

  // 패스워드 확인
  const handlePasswordConfirmChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const confirmPassword = event.target.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    setValue("passwordConfirm", confirmPassword);
    if (confirmPassword === password) {
      setPasswordConfirmMessage("비밀번호가 일치합니다.");

      clearErrors("passwordConfirm"); // 오류 초기화
    } else {
      setPasswordConfirmMessage(null);
      setError("passwordConfirm", { message: "비밀번호가 일치하지 않습니다." });
    }
  };

  const onSubmit: SubmitHandler<SignupInput> = async (data: SignupInput) => {
    // 이메일 중복 에러가 있을 경우, 회원가입 처리 하지 않음
    if (errors.email) {
      alert(errors.email.message);
      return;
    }
    try {
      await signup(data);
      alert("회원가입이 완료되었습니다.");
      router.push("/login");
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="px-5 md:px-4 w-full">
      <form
        className="w-full space-y-9"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* 이메일 입력 */}
        <div className="space-y-2 md:space-y-3">
          <label className="text-sm font-semibold text-[#000301] tracking-tight">
            이메일 주소
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full h-[68px] md:h-[52px] rounded-xl bg-[#F5F5F5] px-4 py-5 
          border-none placeholder:text-[#A1A7B4] placeholder:font-normal outline-none"
            placeholder="ecomoa@naver.com"
            onBlur={handleEmailBlur}
          />
          <div className="min-h-[21px]">
            {errors.email?.message ? (
              <p className="text-sm text-[#FF361B] flex items-center font-medium">
                <CircleAlert
                  className="w-5 h-5 mr-1 text-[#FF361B]"
                  stroke="#FFF"
                  fill="#FF361B"
                />
                {errors.email?.message}
              </p>
            ) : (
              isEmailValid &&
              emailSuccessMessage && (
                <p className="text-sm text-[#179BFF] flex items-center font-medium">
                  <CircleCheck
                    className="w-5 h-5 mr-1"
                    stroke="#FFF"
                    fill="#179BFF"
                  />
                  {emailSuccessMessage}
                </p>
              )
            )}
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div className="space-y-2 md:space-y-3">
          <label className="text-sm font-semibold text-[#000301] tracking-tight">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full h-[68px] md:h-[52px] rounded-xl bg-[#F5F5F5] px-4 py-5 
          border-none placeholder:text-[#A1A7B4] placeholder:font-normal outline-none"
            placeholder="영문, 숫자, 특수문자 8~20 자리"
          />
          <div className="min-h-[21px]">
            {passwordMessage && !errors.password ? (
              <p className="text-sm text-[#179BFF] flex items-center font-medium">
                <CircleCheck
                  className="w-5 h-5 mr-1"
                  stroke="#FFF"
                  fill="#179BFF"
                />
                {passwordMessage}
              </p>
            ) : (
              errors.password?.message && (
                <p className="text-sm text-[#FF361B] flex items-center font-medium">
                  <CircleAlert
                    className="w-5 h-5 mr-1"
                    stroke="#FFF"
                    fill="#FF361B"
                  />
                  {errors.password?.message}
                </p>
              )
            )}
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="space-y-2 md:space-y-3">
          <label className="text-sm font-semibold text-[#000301] tracking-tight">
            비밀번호 확인
          </label>
          <input
            type="password"
            {...register("passwordConfirm")}
            className={`w-full h-[68px] md:h-[52px] rounded-xl bg-[#F5F5F5] px-4 py-5 
          placeholder:text-[#A1A7B4] placeholder:font-normal outline-none
          ${
            errors.passwordConfirm ? "border border-[#FF361B]" : "border-none"
          }`}
            placeholder="비밀번호 확인"
            onChange={handlePasswordConfirmChange}
          />
          <div className="min-h-[21px]">
            {passwordConfirmMessage ? (
              <p className="text-sm text-[#179BFF] flex items-center font-medium">
                <CircleCheck
                  className="w-5 h-5 mr-1"
                  stroke="#FFF"
                  fill="#179BFF"
                />
                {passwordConfirmMessage}
              </p>
            ) : (
              errors.passwordConfirm && (
                <p className="text-sm text-[#FF361B] flex items-center font-medium">
                  <CircleAlert
                    className="w-5 h-5 mr-1"
                    stroke="#FFF"
                    fill="#FF361B"
                  />
                  {errors.passwordConfirm?.message}
                </p>
              )
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="w-full md:w-[380px] mt-12 sm:mt-11">
          <AutoWidthButton
            text="회원가입 하기"
            type="submit"
            onClick={() => {}}
            disabled={Object.keys(errors).length > 0}
          />
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
