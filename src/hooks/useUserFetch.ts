import { useState, useEffect } from "react";
import { UserInfo } from "@/types/userInfoType";
import { getUserInfo } from "@/api/user-action";

export const useUserFetch = (userId: string | null) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId) {
        try {
          const res = await getUserInfo(userId);
          setUserInfo(res);
        } catch (err) {
          console.error("유저 정보를 가져오는 데 실패했습니다.", err);
          setError("유저 정보를 가져오는 데 실패했습니다.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, [userId]);

  return { userInfo, isLoading, error };
};
