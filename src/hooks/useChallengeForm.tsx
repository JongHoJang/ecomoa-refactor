"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useModalStore } from "@/zustand/modalStore";
import { useChallengeStore } from "@/zustand/challengeStore";
import { userStore } from "@/zustand/userStore";
import {
  useChallengeMutation,
  useChallengeUpdateMutation
} from "@/hooks/useChallenge";
import { calculateTotalCarbon } from "@/utlis/challenge/calculateCarbon";
import { CHALLENGES } from "@/utlis/challenge/challenges";
import { ChallengeFormInputs, ChallengeData } from "@/types/challengesType";
import SuccessModal from "@/app/(features)/challenge/components/modal/SuccessModal";
import AlreadySubmittedModal from "@/app/(features)/challenge/components/modal/AlreadySubmittedModal";
import GoBackModal from "@/app/(features)/challenge/components/modal/GoBackModal";

interface UseChallengeFormProps {
  initialData?: ChallengeData;
}

export const useChallengeForm = ({
  initialData
}: UseChallengeFormProps = {}) => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >(initialData?.selected_options || {});
  const { selectedChallenges, setStep, setInitialChallenges } =
    useChallengeStore();
  const { user } = userStore();
  const { openModal, closeModal } = useModalStore();
  const challengeMutation = useChallengeMutation();
  const updateMutation = useChallengeUpdateMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors
  } = useForm<ChallengeFormInputs>({
    defaultValues: {
      content: initialData?.content || "",
      selectedOptions: initialData?.selected_options || {}
    }
  });

  const totalPoint = selectedChallenges.length * 100;
  useEffect(() => {
    if (initialData) {
      const challengeIds = Object.keys(initialData.selected_options);
      setInitialChallenges(challengeIds);
    }
  }, [initialData, setInitialChallenges]);

  const handleOptionToggle = (challengeId: string, optionId: string) => {
    setSelectedOptions((prev) => {
      const currentOptions = prev[challengeId] || [];
      const newOptions = currentOptions.includes(optionId)
        ? currentOptions.filter((id) => id !== optionId)
        : [...currentOptions, optionId];

      const updatedOptions = {
        ...prev,
        [challengeId]: newOptions
      };

      const allOptionsSelected = selectedChallenges.every((id) => {
        const options = updatedOptions[id] || [];
        return options.length > 0;
      });

      if (allOptionsSelected) {
        clearErrors("selectedOptions");
      }

      return updatedOptions;
    });
  };

  const onSubmit = async (
    data: ChallengeFormInputs,
    imageFiles: File[],
    deletedImages?: string[]
  ) => {
    try {
      const unselectedChallenges = selectedChallenges.filter((challengeId) => {
        return (
          !selectedOptions[challengeId] ||
          selectedOptions[challengeId].length === 0
        );
      });

      if (unselectedChallenges.length > 0) {
        const challengeNames = unselectedChallenges
          .map((id) => CHALLENGES.find((c) => c.id === id)?.label)
          .filter(Boolean)
          .join(", ");

        setError("selectedOptions", {
          type: "validate",
          message: `${challengeNames}의 상세 항목을 선택해주세요.`
        });
        return;
      }

      if (initialData) {
        await updateMutation.mutateAsync({
          userId: user.id,
          challengeId: initialData.chall_id,
          content: data.content,
          selectedOptions,
          images: imageFiles,
          deletedImages,
          existingImages: initialData.image_urls.filter((url) =>
            deletedImages?.includes(url) ? false : true
          )
        });

        openModal({
          type: "alert",
          content: "챌린지가 성공적으로 수정되었습니다.",
          autoClose: 2000
        });
      } else {
        const totalCarbon = calculateTotalCarbon(selectedChallenges);

        await challengeMutation.mutateAsync({
          userId: user.id,
          content: data.content,
          images: imageFiles,
          selectedOptions,
          carbon: totalCarbon,
          point: totalPoint
        });

        openModal({
          type: "custom",
          content: (
            <SuccessModal
              onClose={closeModal}
              selectedChallenges={selectedChallenges}
            />
          ),
          autoClose: 5000
        });
      }

      setStep(1);
    } catch (error) {
      if (
        !initialData &&
        error instanceof Error &&
        error.message.includes("이미 오늘의 챌린지를 제출")
      ) {
        openModal({
          type: "custom",
          content: (
            <AlreadySubmittedModal
              onGoBack={() => {
                setStep(1);
                closeModal();
              }}
            />
          )
        });
      } else {
        // openModal({
        //   type: "alert",
        //   content:
        //     error instanceof Error
        //       ? error.message
        //       : "챌린지 등록에 실패했습니다.",
        //   autoClose: 2000
        // });
        console.error("오류입니다.");
      }
    }
  };

  const handleOpenGoBackModal = () =>
    openModal({
      type: "custom",
      content: (
        <GoBackModal
          onClose={closeModal}
          onGoBack={() => {
            setStep(1);
            closeModal();
          }}
          point={totalPoint}
          isEditMode={!!initialData}
        />
      )
    });

  return {
    selectedOptions,
    register,
    handleSubmit,
    errors,
    handleOptionToggle,
    onSubmit,
    challengeMutation,
    updateMutation,
    isEditMode: !!initialData,
    handleOpenGoBackModal,
    totalPoint
  };
};
