import { useChallengeDashboard } from "@/hooks/useChallengeDashboard";
import React from "react";
import LevelSection from "./header/LevelSection";
import StatsSection from "./header/StatsSection";
import { userStore } from "@/zustand/userStore";

const ChallengeHeader = () => {
  const { user } = userStore();

  const { isLoading, error, todayChallenge, levelInfo, co2Difference } =
    useChallengeDashboard(user.id);

  if (error) return <>{error.message}</>;

  return (
    <header className="flex flex-row justify-between">
      <StatsSection
        todayChallenge={todayChallenge}
        co2Difference={co2Difference}
        isLoading={isLoading}
      />
      <LevelSection levelInfo={levelInfo} isLoading={isLoading} />
    </header>
  );
};

export default ChallengeHeader;