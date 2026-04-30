// src/lib/kakaoLoader.js

let kakaoPromise = null;

export function loadKakaoMaps() {
    // 이미 로드 + 초기화가 끝났으면 바로 리턴
    if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
        return Promise.resolve(window.kakao);
    }

    // 이미 로드 중이면 같은 Promise 재사용
    if (kakaoPromise) return kakaoPromise;

    kakaoPromise = new Promise((resolve, reject) => {
        const key = import.meta.env.VITE_KAKAO_MAP_KEY;
        if (!key) {
            reject(new Error("❌ VITE_KAKAO_MAP_KEY가 .env에 없습니다."));
            return;
        }

        // 혹시 이미 script가 붙어있으면 그걸 재사용
        let script = document.querySelector("script[data-kakao-maps-sdk]");
        if (!script) {
            script = document.createElement("script");
            script.src =
                `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}` +
                `&autoload=false&libraries=services`;
            script.async = true;
            script.dataset.kakaoMapsSdk = "true";
            document.head.appendChild(script);
        }

        script.onload = () => {
            if (!window.kakao || !window.kakao.maps) {
                reject(new Error("❌ kakao.maps가 정의되지 않았습니다."));
                return;
            }

            // ✅ 이 콜백 안에서야 LatLng 같은 생성자가 준비됨
            window.kakao.maps.load(() => {
                if (!window.kakao.maps.LatLng) {
                    reject(
                        new Error("❌ kakao.maps.load 후에도 LatLng가 없습니다.")
                    );
                    return;
                }
                resolve(window.kakao);
            });
        };

        script.onerror = () => {
            reject(new Error("❌ Kakao Maps SDK 로딩 실패"));
        };
    });

    return kakaoPromise;
}
