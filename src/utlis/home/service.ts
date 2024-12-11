export const ServiceCard = {
  bus: {
    imageSrc: "/images/bus.png",
    titleLines: ["대중교통", "이용하기"]
  },
  bike: {
    imageSrc: "/images/bicycle.png",
    titleLines: ["자전거", "이용하기"]
  },
  bag: {
    imageSrc: "/images/bag.png",
    titleLines: ["일회용품", "사용하지 않기"]
  },
  electricity: {
    imageSrc: "/images/electricity.png",
    titleLines: ["전기 플래그", "뽑기"]
  },
  trash: {
    imageSrc: "/images/trash.png",
    titleLines: ["안쓰는 디지털 파일", "정리하기"]
  },
  eco: {
    imageSrc: "/images/eco.png",
    titleLines: ["친환경 제품", "구매하기"]
  }
};

export interface ImageSize {
    mobile: {
      width: number;
      height: number;
    };
    desktop: {
      width: number;
      height: number;
    };
   }

   
   // utils/service.ts
   export const ServiceLevels = {
    seed: {
      level: 1,
      title: "씨앗모아",
      imageSrc: "/service/serviceSeed.png",
      description: "가능성을 품고 있는 작은 씨앗",
      imageSize: {
        mobile: {
          width: 164,
          height: 199
        },
        desktop: {
          width: 280,
          height: 204
        }
      }
    },
    leaf: {
      level: 2,
      title: "새싹모아",
      imageSrc: "/service/serviceLeaf.png",
      description: "성장의 시작으로 돋아난 새싹",
      imageSize: {
        mobile: {
          width: 163,
          height: 166
        },
        desktop: {
          width: 280,
          height: 204
        }
      }
    },
    tree: {
      level: 3,
      title: "트리모아",
      imageSrc: "/service/serviceTree.png",
      description: "생명을 지키는 강인한 나무",
      imageSize: {
        mobile: {
          width: 155,
          height: 168
        },
        desktop: {
          width: 280,
          height: 204
        }
      }
    },
    clover: {
      level: 4,
      title: "클로바모아",
      imageSrc: "/service/serviceClover.png",
      description: "결심을 맺은 행운의 네잎클로버",
      imageSize: {
        mobile: {
          width: 145,
          height: 168
        },
        desktop: {
          width: 280,
          height: 204
        }
      }
    }
   };
   
   export const ServiceLevelsColors: Record<number, string> = {
    1: "bg-[#321C00]",
    2: "bg-[#320008]",
    3: "bg-[#00320F]",
    4: "bg-[#000132]"
   };