"use client";
import { ImageValidation } from "@/types/challengesType";
import { useState, useEffect } from "react";

export const useImageUpload = (maxImages = 6, initialImages?: string[]) => {
  const [existingImages, setExistingImages] = useState<string[]>(
    initialImages || []
  );
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  useEffect(() => {
    if (initialImages) {
      setExistingImages(initialImages);
    }
  }, [initialImages]);

  const validateImage = (file: File): ImageValidation => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        message: "JPG, PNG, GIF, WEBP 형식의 이미지만 업로드 가능합니다."
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        message: "이미지 크기는 5MB 이하여야 합니다."
      };
    }

    return { isValid: true };
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.isValid) {
      alert(validation.message);
      e.target.value = "";
      return;
    }

    const totalImages = existingImages.length + imageFiles.length;
    if (totalImages >= maxImages) {
      alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviews((prev) => [...prev, previewUrl]);
    setImageFiles((prev) => [...prev, file]);
    e.target.value = "";
  };

  const handleDeleteImage = (index: number) => {
    setPreviews((prev) => {
      const newPreviews = [...prev];
      if (newPreviews[index]) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });
    setImageFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleDeleteExistingImage = (index: number) => {
    const imageToDelete = existingImages[index];
    setDeletedImages((prev) => [...prev, imageToDelete]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    previews,
    imageFiles,
    existingImages,
    deletedImages,
    handleImageChange,
    handleDeleteImage,
    handleDeleteExistingImage,
    validateImage
  };
};
