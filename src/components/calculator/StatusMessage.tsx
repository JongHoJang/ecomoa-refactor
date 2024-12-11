import React from "react";

interface StatusMessageProps {
  type: "loading" | "empty";
  message?: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message }) => {
  const defaultMessages = {
    loading: "데이터를 가지고 오는 중 입니다...",
    empty: "탄소계산기를 통해 계산한 데이터가 없습니다."
  };

  return (
    <div className="flex items-center justify-center mx-auto">
      <div className="text-gray-500 text-[16px]">
        {message || defaultMessages[type]}
      </div>
    </div>
  );
};

export default StatusMessage;
