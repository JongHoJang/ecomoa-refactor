interface EmissionLeftSideProps {
  userNickname: string;
  avgEmission: number;
  userAvgData: number | null;
  myAllAvgData: number;
}

const EmissionLeftSide: React.FC<EmissionLeftSideProps> = ({
  userNickname,
  avgEmission,
  userAvgData,
  myAllAvgData
}) => (
  <>
    <div>
      <p className="text-black text-[24px] md:text-[36px] font-bold mb-[36px] leading-[1]">
        {userNickname}님의 평균 배출량
      </p>
      <p className="text-[#0D9C36] text-[36px] md:text-[48px] font-semibold mb-[40px]">
        {avgEmission.toFixed(2)}kg
      </p>
    </div>
    <div className="text-[14px] md:text-[16px] mb-[20px] md:mb-0">
      탄소 배출량이 평균 보다{" "}
      {userAvgData && myAllAvgData ? (
        myAllAvgData > 0 ? (
          Number(userAvgData) < myAllAvgData ? (
            <>
              {((myAllAvgData / Number(userAvgData) - 1) * 100).toFixed(2)} %
              높아요!
            </>
          ) : (
            <>
              {((Number(userAvgData) / myAllAvgData - 1) * 100).toFixed(2)} %
              낮아요!
            </>
          )
        ) : (
          <span>현재 평균 배출량이 계산되지 않았습니다.</span>
        )
      ) : null}
    </div>
  </>
);

export default EmissionLeftSide;
