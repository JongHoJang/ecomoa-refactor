"use server";

import { createClient } from "@supabase/supabase-js";
// Service Role Key를 사용하는 서버 측 Supabase 클라이언트 생성
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 회원탈퇴
export const deleteUser = async (userId: string) => {
  console.log("딜리트 유저 함수 들어옴");
  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  console.log("@@@@@@@@@@@@", data);
  console.log("#######", error);

  if (error) {
    console.error("회원 탈퇴 에러:", error);
  }

  console.log("회원 탈퇴 성공:", data);
  // const { error: authError } = await supabaseAdmin.auth.signOut();
  //console.log("회원탈퇴 ㅁㅁㅁ ", a);

  return true;
};
