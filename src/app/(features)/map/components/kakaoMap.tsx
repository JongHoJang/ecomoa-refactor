"use client";
import { Store } from "@/types/map";
import { useEffect, useRef, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import MapController from "./ui/MapController";

interface KakaoMapProps {
  storeList: Store[];
  selectedStoreId: string | null;
  onClick: (store: Store) => void;
}

const KakaoMap = ({ storeList, selectedStoreId, onClick }: KakaoMapProps) => {
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(8);
  const mapRef = useRef<kakao.maps.Map>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&autoload=false`;
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(() => {
          setIsMapLoaded(true);
        });
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !selectedStoreId || !storeList) return;

    const selectedStore = storeList.find(
      (store) => store.store_id === selectedStoreId
    );

    if (!selectedStore) return;

    const moveLatLng = new kakao.maps.LatLng(
      selectedStore.lat,
      selectedStore.lon
    );
    mapRef.current.setCenter(moveLatLng);
    setLevel(3);
  }, [selectedStoreId, storeList]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setUserLocation({ lat, lng });

          if (mapRef.current) {
            const moveLatLng = new kakao.maps.LatLng(lat, lng);
            mapRef.current.setCenter(moveLatLng);
            setLevel(5);
          }
        },
        (error) => {
          console.error("현재 위치를 가져올 수 없습니다:", error);
          alert("위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.");
        }
      );
    } else {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current && level > 1) {
      const newLevel = level - 1;
      mapRef.current.setLevel(newLevel);
      setLevel(newLevel);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current && level < 14) {
      const newLevel = level + 1;
      mapRef.current.setLevel(newLevel);
      setLevel(newLevel);
    }
  };

  return (
    <div className="w-full md:w-2/3 h-[360px] md:h-[822px] relative">
      {isMapLoaded && (
        <div className="w-full h-full rounded-2xl overflow-hidden">
          <Map
            ref={mapRef}
            center={{
              lat: 37.566826,
              lng: 126.978656
            }}
            style={{
              width: "100%",
              height: "100%"
            }}
            level={level}
            draggable={true}
            zoomable={true}
            onZoomChanged={(map) => setLevel(map.getLevel())}
          >
            {userLocation && (
              <MapMarker
                position={userLocation}
                image={{
                  src: "/images/selectedMarker.png",
                  size: { width: 40, height: 46 }
                }}
              />
            )}

            {level <= 5 &&
              storeList?.map((store) => (
                <MapMarker
                  key={store.store_id}
                  position={{ lat: store.lat, lng: store.lon }}
                  onClick={() => onClick(store)}
                  image={{
                    src:
                      selectedStoreId === store.store_id
                        ? "/images/selectedMarker.png"
                        : "/images/marker.png",
                    size: {
                      width: 40,
                      height: 46
                    }
                  }}
                >
                  {selectedStoreId === store.store_id && (
                    <div
                      className="p-2 w-[200px] md:w-[280px]"
                      style={{ border: "none" }}
                    >
                      <div className="mb-2 pb-2 border-b border-gray-100">
                        <h3 className="font-bold text-sm md:text-base text-gray-800 break-words">
                          {store.store_name}
                        </h3>
                      </div>
                      <div className="text-xs md:text-sm space-y-1">
                        <div className="text-gray-600 break-words whitespace-pre-wrap">
                          {store.road_address}
                        </div>
                        <div className="text-gray-500 break-words whitespace-pre-wrap">
                          {store.operating_hours}
                        </div>
                        <div className="text-gray-500 break-words whitespace-pre-wrap">
                          {store.contact_number}
                        </div>
                      </div>
                    </div>
                  )}
                </MapMarker>
              ))}
          </Map>
        </div>
      )}

      <MapController
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onCurrentLocation={getCurrentLocation}
      />
    </div>
  );
};

export default KakaoMap;
