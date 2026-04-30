// src/components/KakaoSearchModal.jsx
import { useEffect, useRef, useState } from "react";
import { loadKakaoMaps } from "../lib/kakaoLoader";

/**
 * props:
 *  - onSelect(place): { name, address, roadAddress, lat, lng, phone, kakaoPlaceId }
 *  - onClose()
 */
export default function KakaoSearchModal({ onSelect, onClose }) {
    const mapRef = useRef(null);
    const [kakaoLoaded, setKakaoLoaded] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState([]);
    const [mapObj, setMapObj] = useState(null);
    const [markers, setMarkers] = useState([]);

    // 1) 카카오 SDK 로드 + 지도 초기화
    useEffect(() => {
        let mapInstance = null;

        loadKakaoMaps()
            .then((kakao) => {
                console.log("kakao from loader:", kakao, kakao.maps && kakao.maps.LatLng);
                const center = new kakao.maps.LatLng(37.5665, 126.9780); // 서울 시청 근처
                mapInstance = new kakao.maps.Map(mapRef.current, {
                    center,
                    level: 5,
                });
                setMapObj(mapInstance);
                setKakaoLoaded(true);
            })
            .catch((err) => {
                console.error("Kakao 지도 로드 실패:", err);
            });

        // 언마운트 시 마커 정리
        return () => {
            markers.forEach((m) => m.setMap(null));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2) 검색 실행 함수
    const handleSearch = () => {
        if (!keyword.trim()) return;
        if (!window.kakao || !window.kakao.maps || !kakaoLoaded || !mapObj) return;

        const kakao = window.kakao;
        const places = new kakao.maps.services.Places();

        places.keywordSearch(keyword, (data, status) => {
            if (status !== kakao.maps.services.Status.OK) {
                setResults([]);
                return;
            }

            // 기존 마커 제거
            markers.forEach((m) => m.setMap(null));

            const bounds = new kakao.maps.LatLngBounds();
            const newMarkers = [];
            const placeList = data.map((item) => {
                const lat = Number(item.y);
                const lng = Number(item.x);
                const position = new kakao.maps.LatLng(lat, lng);

                const marker = new kakao.maps.Marker({
                    map: mapObj,
                    position,
                });
                newMarkers.push(marker);
                bounds.extend(position);

                return {
                    name: item.place_name,
                    address: item.address_name,
                    roadAddress: item.road_address_name,
                    lat,
                    lng,
                    phone: item.phone,
                    kakaoPlaceId: item.id,
                };
            });

            setMarkers(newMarkers);
            setResults(placeList);

            if (!bounds.isEmpty()) {
                mapObj.setBounds(bounds);
            }
        });
    };

    // 3) 리스트에서 하나 선택했을 때
    const handleSelect = (place) => {
        if (!mapObj || !window.kakao) {
            onSelect?.(place);
            return;
        }

        const kakao = window.kakao;
        const pos = new kakao.maps.LatLng(place.lat, place.lng);
        mapObj.panTo(pos);
        onSelect?.(place);
    };

    // 엔터 키로 검색
    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className="kakao-modal-backdrop">
            <div className="kakao-modal">
                {/* 상단 영역 */}
                <div className="kakao-modal-header">
                    <h2>카카오맵에서 카페 검색</h2>
                    <button className="kakao-close-btn" type="button" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* 검색창 */}
                <div className="kakao-search-row">
                    <input
                        className="kakao-search-input"
                        type="text"
                        placeholder="카페 이름 또는 주소를 입력하세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={onKeyDown}
                    />
                    <button
                        className="kakao-search-button"
                        type="button"
                        onClick={handleSearch}
                    >
                        검색
                    </button>
                </div>

                {/* 본문: 왼쪽 리스트 / 오른쪽 지도 */}
                <div className="kakao-content">
                    <div className="kakao-result-list">
                        {results.length === 0 && (
                            <div className="kakao-result-empty">
                                검색 결과가 없습니다.
                                <br />
                                카페 이름이나 지점명을 다시 입력해보세요.
                            </div>
                        )}

                        {results.map((place) => (
                            <button
                                key={place.kakaoPlaceId}
                                type="button"
                                className="kakao-result-item"
                                onClick={() => handleSelect(place)}
                            >
                                <div className="kakao-result-name">{place.name}</div>
                                <div className="kakao-result-address">
                                    {place.roadAddress || place.address}
                                </div>
                                {place.phone && (
                                    <div className="kakao-result-phone">{place.phone}</div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="kakao-map-wrapper">
                        <div ref={mapRef} className="kakao-map-container" />
                    </div>
                </div>
            </div>
        </div>
    );
}
