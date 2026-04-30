// src/pages/Home.jsx

export default function Home({ onGotoMap, onGotoNew }) {
    return (
        <div className="home-page">
            {/* 배경 오브젝트 */}
            <div className="home-orb home-orb--left" />
            <div className="home-orb home-orb--right" />

            <main className="home-inner">
                {/* 🔹 히어로 카드 (좌: 텍스트, 우: 프리뷰) */}
                <section className="home-hero-card">
                    <div className="home-hero-main">
                        <span className="home-pill">☕ 카페 방문 기록 다이어리</span>

                        <h1 className="home-title">
                            카페 방문 <span className="home-title-emph">기록 지도</span>
                        </h1>

                        <p className="home-sub">
                            내가 다녀온 카페, 친구가 추천한 카페를 한 곳에 모아두고
                            <br />
                            <span className="home-sub-highlight">
                공부하기 좋은 정도 · 콘센트 · 와이파이
              </span>
                            를 한눈에 확인해요.
                        </p>

                        <div className="home-actions">
                            <button className="home-btn primary" onClick={onGotoNew}>
                                <span className="home-btn-icon">✏️</span>
                                새 카페 등록하기
                            </button>
                            <button className="home-btn secondary" onClick={onGotoMap}>
                                <span className="home-btn-icon">🗺</span>
                                지도에서 한눈에 보기
                            </button>
                        </div>

                        <p className="home-caption">
                            오늘 다녀온 카페부터 가볍게 기록해 보세요.
                            <br />
                            나만의 카페 아카이브가 차곡차곡 쌓여요.
                        </p>
                    </div>

                    {/* 🔹 오른쪽 비주얼 영역 (텍스트 없이 디자인만) */}
                    <div className="home-hero-visual">
                        <div className="home-hero-map home-hero-map--art">
                            <div className="home-hero-map-glow" />

                            {/* 겹치는 원 궤도들 */}
                            <div className="home-hero-orbit home-hero-orbit--lg" />
                            <div className="home-hero-orbit home-hero-orbit--md" />
                            <div className="home-hero-orbit home-hero-orbit--sm" />

                            {/* 작은 포인트들 (카페 위치 느낌만) */}
                            <div className="home-hero-dot home-hero-dot--main" />
                            <div className="home-hero-dot home-hero-dot--sub1" />
                            <div className="home-hero-dot home-hero-dot--sub2" />
                        </div>
                    </div>
                </section>

                {/* 🔹 아래 기능 카드 2개 */}
                <section className="home-panels">
                    <article className="home-card">
                        <div className="home-card-header">
                            <span className="home-card-tag">Archive</span>
                            <h2 className="home-card-title">나만의 카페 아카이브</h2>
                        </div>

                        <p className="home-card-desc">
                            방문 날짜, 만족도, 메모를 함께 저장해서
                            <br />
                            <strong>“다음에 어디 가지?”</strong> 고민될 때 바로 꺼내볼 수 있어요.
                        </p>

                        <ul className="home-card-list">
                            <li>✔ 방문 시각 & 메모 기록</li>
                            <li>✔ 공부 점수, 콘센트 · 와이파이 상태 저장</li>
                            <li>✔ 닉네임으로 내 기록 / 친구 기록 구분</li>
                        </ul>
                    </article>

                    <article className="home-card">
                        <div className="home-card-header">
                            <span className="home-card-tag home-card-tag--map">Map View</span>
                            <h2 className="home-card-title">지도 기반 시각화</h2>
                        </div>

                        <p className="home-card-desc">
                            등록된 카페를 지도 위에 뿌려주어서
                            <br />
                            <strong>“근처에 공부하기 좋은 카페”</strong>를 쉽게 찾을 수 있어요.
                        </p>

                        <ul className="home-card-list">
                            <li>📍 만족도별 색상 / 아이콘 표시</li>
                            <li>🔌 콘센트 / 와이파이 필터 (확장 예정)</li>
                            <li>👥 여러 사용자 기록 함께 보기</li>
                        </ul>
                    </article>
                </section>
            </main>
        </div>
    );
}
