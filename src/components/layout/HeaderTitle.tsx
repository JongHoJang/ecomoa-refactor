interface HeaderTitleProps {
  title: string;
  subTitle?: string;
  description: string;
  titleSize?: string; // 기본값을 설정할 수 있도록 optional로 설정
  descriptionSize?: string;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({
  title,
  subTitle,
  description,
  titleSize = "text-[24px] md:text-[30px]",
  descriptionSize = "text-[16px] md:text-[20px]"
}) => {
  return (
    <>
      <div
        className={`text-[#32343a] font-semibold mb-[16px] md:mb-[28px] ${titleSize}`}
      >
        {title}
      </div>
      <div
        className={`text-[#32343a] font-semibold mb-[16px] md:mb-[28px] ${titleSize}`}
      >
        {subTitle}
      </div>
      <div
        className={`font-normal text-[#00691E] leading-[1] ${descriptionSize}`}
      >
        {description}
      </div>
    </>
  );
};

export default HeaderTitle;
