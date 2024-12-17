"use client";
import { useChallengeList, useUserChallengeList } from "@/hooks/useChallenge";
import { calculateLevelInfo } from "@/utlis/challenge/levelCalculator";
import { useEffect, useState } from "react";
import { LevelInfo } from "@/types/challengesType";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/api/user-action";
import { UserInfo } from "@/types/userInfoType";

export const useChallengeDashboard = (userId: string) => {
  const {
    data: userInfo,
    isLoading: isUserInfoLoading,
    error: userInfoError
  } = useQuery<UserInfo | null>({
    queryKey: ["userInfo", userId],
    queryFn: () => getUserInfo(userId),
    enabled: !!userId, // userId가 있을 때만 실행
    retry: 3,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  // 기존 데이터 페칭
  const {
    data: challengesData,
    isLoading: isUserChallengeLoading,
    error
  } = useUserChallengeList(userId);

  const { data: challengesList, isLoading: isChallengeListLoading } =
    useChallengeList();

  const [co2Difference, setCo2Difference] = useState(0);
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);

  // 전체 로딩 상태 계산
  const isLoading =
    isUserChallengeLoading ||
    isChallengeListLoading ||
    isUserInfoLoading ||
    !userId;

  // 오늘의 챌린지 계산
  // -> 오늘의 챌린지를 처음부터 api로 요청

  const today = new Date()
    .toLocaleDateString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    .split(".")
    .slice(0, 3)
    .map((s) => s.trim().padStart(2, "0"))
    .join("-");

  const todayChallenge = challengesData
    ?.filter((challenge) => challenge.created_at.split("T")[0] === today)
    ?.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

  // 레벨 정보 계산 - useEffect로 이동
  useEffect(() => {
    if (!challengesData || isLoading) {
      setLevelInfo(null);
      return;
    }

    const calculatedLevelInfo = calculateLevelInfo(userInfo?.user_point ?? 0);
    setLevelInfo(calculatedLevelInfo);
  }, [challengesData, isLoading, userInfo?.user_point]);

  // CO2 차이 계산
  useEffect(() => {
    if (!challengesList || challengesList.length === 0) {
      setCo2Difference(0);
      return;
    }

    const totalCo2 = challengesList.reduce(
      (sum, challenge) => sum + challenge.co2,
      0
    );
    const averageCo2 = totalCo2 / challengesList.length;
    const difference = (todayChallenge?.co2 || 0) - averageCo2;
    setCo2Difference(difference);
  }, [challengesList, todayChallenge]);

  return {
    isLoading,
    error,
    todayChallenge,
    levelInfo,
    co2Difference,
    userInfoError,
    userInfo
  };
};
