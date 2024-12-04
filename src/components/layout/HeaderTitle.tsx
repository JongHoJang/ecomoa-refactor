import React from "react";

interface HeaderTitleProps {
  title: string;
  description: string;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ title, description }) => {
  return (
    <>
      <div className="text-[#32343a] text-[24px] md:text-[30px] font-semibold mb-[16px] md:mb-[28px]">
        {title}
      </div>
      <div className=" text-[16px] md:text-[20px] font-normal text-[#00691E] leading-[1]">
        {description}
      </div>
    </>
  );
};

export default HeaderTitle;
