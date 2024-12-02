import { ChallengeFormInputs } from "@/types/challengesType";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<ChallengeFormInputs>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FieldErrors<ChallengeFormInputs>;
  previews: string[];
  onDelete: (index: number) => void;
  maxImages?: number;
  existingImages?: string[];
  onDeleteExisting?: (index: number) => void;
}

const ImageUpload = ({
  register,
  onChange,
  errors,
  previews,
  onDelete,
  maxImages = 6,
  existingImages = [],
  onDeleteExisting
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const totalImages = existingImages.length + previews.length;
  const remainingSlots = maxImages - totalImages;
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const registerProps = register("images");

  const checkScrollable = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkScrollable();
    const resizeObserver = new ResizeObserver(checkScrollable);
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [totalImages]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 220 + 16;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll =
        direction === "left"
          ? Math.max(0, currentScroll - scrollAmount)
          : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth"
      });
    }
  };

  const handleAddImage = () => {
    if (remainingSlots > 0) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="mt-4 md:mt-6">
      <input
        {...registerProps}
        ref={(e) => {
          registerProps.ref(e);
          if (e) fileInputRef.current = e;
        }}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={(e) => {
          registerProps.onChange(e);
          onChange(e);
        }}
        className="hidden"
        multiple
      />

      {errors.images && (
        <p className="text-red-500 text-xs md:text-sm">
          {errors.images.message}
        </p>
      )}

      <h1 className="font-bold text-xs md:text-[14px] mb-2">
        사진 ({totalImages}/{maxImages})
      </h1>

      <div className="relative">
        {showLeftButton && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              scroll("left");
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {showRightButton && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              scroll("right");
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div
          className="overflow-x-hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 pb-4 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div
              onClick={handleAddImage}
              className="relative w-[160px] h-[160px] md:w-[220px] md:h-[220px] flex-shrink-0 rounded-lg overflow-hidden bg-[#F5F5F5] cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <div className="absolute inset-0 flex-col-center text-gray-400">
                <div className="bg-white rounded-full w-[30px] h-[30px] p-2">
                  <Plus className="w-full h-full" />
                </div>
              </div>
            </div>

            {existingImages.map((url, index) => (
              <div
                key={`existing-${index}`}
                className="relative w-[160px] h-[160px] md:w-[220px] md:h-[220px] flex-shrink-0 rounded-lg overflow-hidden"
              >
                <Image
                  src={url}
                  alt={`기존 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {onDeleteExisting && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteExisting(index);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-400/80 hover:bg-gray-500/80 text-white transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {previews.map((preview, index) => (
              <div
                key={`preview-${index}`}
                className="relative w-[160px] h-[160px] md:w-[220px] md:h-[220px] flex-shrink-0 rounded-lg overflow-hidden"
              >
                <Image
                  src={preview}
                  alt={`미리보기 ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(index);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-400/80 hover:bg-gray-500/80 text-white transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-xs md:text-sm mt-2">
        * JPG, PNG, GIF, WEBP 형식의 5MB 이하 이미지만 업로드 가능합니다.
      </p>
    </div>
  );
};

export default ImageUpload;