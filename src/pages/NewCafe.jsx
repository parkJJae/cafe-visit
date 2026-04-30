// src/pages/NewCafe.jsx
import { useState } from "react";
import axios from "axios";
import KakaoSearchModal from "../components/KakaoSearchModal";

export default function NewCafe({ onBack }) {
    const [form, setForm] = useState({
        name: "",
        address: "",
        rating: 5,
        priceLevel: 2,
        hasOutlet: true,
        wifiSpeed: "FAST",
        studyScore: 3,
        memo: "",
        nickname: "",
        // 카카오에서 받아올 좌표
        lat: null,
        lng: null,
    });

    const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
    const [isKakaoOpen, setIsKakaoOpen] = useState(false); // 카카오 모달 열림 여부

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // ✅ 카카오 모달에서 장소 선택했을 때
    const handlePlaceSelect = (place) => {
        setForm((prev) => ({
            ...prev,
            name: place.name || prev.name,
            address: place.roadAddress || place.address || prev.address,
            lat: place.lat ?? prev.lat,
            lng: place.lng ?? prev.lng,
        }));
        setIsKakaoOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        try {
            // 숫자 필드는 숫자로 변환
            const payload = {
                name: form.name,
                address: form.address,
                rating: Number(form.rating) || null,
                priceLevel: Number(form.priceLevel) || null,
                hasOutlet: form.hasOutlet,
                wifiSpeed: form.wifiSpeed,
                studyScore: Number(form.studyScore) || null,
                memo: form.memo,
                nickname: form.nickname,
                // 👉 카카오에서 받은 좌표가 있으면 그걸, 없으면 기존 기본값
                lat: form.lat ?? 37.4979,
                lng: form.lng ?? 127.0276,
                visitedAt: new Date().toISOString(),
            };

            await axios.post("http://localhost:8080/api/cafes", payload, {
                headers: { "Content-Type": "application/json" },
            });

            setStatus("success");
            // 성공 시 일부 폼 리셋하고 싶으면 아래 주석 해제
            // setForm((prev) => ({ ...prev, name: "", address: "", memo: "" }));
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <div className="new-page">
            {/* 상단 바 */}
            <header className="top-bar">
                {onBack && (
                    <button className="top-back" onClick={onBack}>
                        ← 홈으로
                    </button>
                )}
                <span className="top-title">카페 등록하기</span>
            </header>

            <main className="new-main">
                <form className="new-form" onSubmit={handleSubmit}>
                    <h2>새 카페 기록 추가</h2>
                    <p className="new-sub">
                        최소 정보만 적어도 괜찮아요. 나중에 다시 와서 수정해도 돼요.
                    </p>

                    {/* 카페 이름 + 카카오 검색 버튼 */}
                    <label className="field">
                        <div className="field-label-row">
                            <span>카페 이름</span>
                            <button
                                type="button"
                                className="kakao-inline-btn"
                                onClick={() => setIsKakaoOpen(true)}
                            >
                                카카오맵에서 찾기
                            </button>
                        </div>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="field">
                        <span>주소</span>
                        <input
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <div className="field-row">
                        <label className="field">
                            <span>만족도 (1~5)</span>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                name="rating"
                                value={form.rating}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="field">
                            <span>가격대 (1~3)</span>
                            <input
                                type="number"
                                min="1"
                                max="3"
                                name="priceLevel"
                                value={form.priceLevel}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="field-row">
                        <label className="field">
                            <span>공부 점수 (1~5)</span>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                name="studyScore"
                                value={form.studyScore}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="field">
                            <span>와이파이 속도</span>
                            <select
                                name="wifiSpeed"
                                value={form.wifiSpeed}
                                onChange={handleChange}
                            >
                                <option value="FAST">FAST</option>
                                <option value="NORMAL">NORMAL</option>
                                <option value="SLOW">SLOW</option>
                            </select>
                        </label>
                    </div>

                    <div className="field-row">
                        <label className="field checkbox">
                            <input
                                type="checkbox"
                                name="hasOutlet"
                                checked={form.hasOutlet}
                                onChange={handleChange}
                            />
                            🔌 콘센트 있음
                        </label>
                    </div>

                    <label className="field">
                        <span>닉네임</span>
                        <input
                            name="nickname"
                            value={form.nickname}
                            onChange={handleChange}
                            placeholder="재현, JAY 같은 이름"
                            required
                        />
                    </label>

                    <label className="field">
                        <span>메모</span>
                        <textarea
                            name="memo"
                            value={form.memo}
                            onChange={handleChange}
                            rows={3}
                            placeholder="좌석 분위기, 소음, 추천 메뉴 등 자유롭게 적어주세요."
                        />
                    </label>

                    <button
                        className="home-btn primary"
                        type="submit"
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? "등록 중..." : "기록 저장하기"}
                    </button>

                    {status === "success" && (
                        <p className="status success">✅ 등록이 완료되었습니다!</p>
                    )}
                    {status === "error" && (
                        <p className="status error">
                            ⚠️ 등록 중 오류가 발생했습니다. 백엔드 서버와 주소를 확인해주세요.
                        </p>
                    )}
                </form>
            </main>

            {/* 🔍 카카오 검색 모달 */}
            {isKakaoOpen && (
                <KakaoSearchModal
                    onSelect={handlePlaceSelect}
                    onClose={() => setIsKakaoOpen(false)}
                />
            )}
        </div>
    );
}
