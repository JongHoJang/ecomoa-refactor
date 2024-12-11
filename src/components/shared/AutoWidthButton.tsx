interface Props {
  className?: string; 
  text: string;     
  type?: "button" | "submit";  
  onClick: () => void;         
  disabled?: boolean;       
  bgColor?: string;      
}

const AutoWidthButton = ({
  className = "", 
  text,
  type = "button",
  onClick,
  disabled = false,
  bgColor = "#0D9C36" 
}: Props) => {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`h-[60px] w-full text-white ${className} rounded-full
        ${disabled ? "opacity-50" : ""}
        ${bgColor ? `bg-[${bgColor}]` : "bg-[#0D9C36]"}
        `}
    > 
      {text}
    </button>
  );
};

export default AutoWidthButton;