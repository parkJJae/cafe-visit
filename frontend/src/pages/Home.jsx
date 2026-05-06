// src/pages/Home.jsx

export default function Home({ onGotoMap, onGotoNew }) {
    return (
        <div className="home-page">
            <div className="home-orb home-orb--left" />
            <div className="home-orb home-orb--right" />

            <main className="home-inner">
                <section className="home-hero-card">
                    <div className="home-hero-main">
                        <span className="home-pill">☕ 카페 방문 기록</span>

                        <h1 className="home-title">
                            내가 다녀온 카페,<br />
                            <span className="home-title-emph">지도</span>로 다시 만나요
                        </h1>

                        <p className="home-sub">
                            방문한 카페의 분위기, 콘센트, 와이파이 속도를 기록하고
                            <br />
                            지도에서 한눈에 다시 찾아볼 수 있어요.
                        </p>

                        <div className="home-actions">
                            <button className="home-btn primary" onClick={onGotoNew}>
                                <span className="home-btn-icon">+</span>
                                새 카페 등록
                            </button>
                            <button className="home-btn secondary" onClick={onGotoMap}>
                                지도에서 보기
                            </button>
                        </div>

                        <p className="home-caption">
                            로그인 없이 바로 시작할 수 있어요.
                        </p>
                    </div>

                    <div className="home-hero-visual">
                        <div className="home-hero-map home-hero-map--art">
                            <div className="home-hero-map-glow" />
                            <div className="home-hero-orbit home-hero-orbit--lg" />
                            <div className="home-hero-orbit home-hero-orbit--md" />
                            <div className="home-hero-orbit home-hero-orbit--sm" />
                            <div className="home-hero-dot home-hero-dot--main" />
                            <div className="home-hero-dot home-hero-dot--sub1" />
                            <div className="home-hero-dot home-hero-dot--sub2" />
                        </div>
                    </div>
                </section>

                <section className="home-panels">
                    <article className="home-card">
                        <div className="home-card-header">
                            <span className="home-card-tag">기록</span>
                            <h2 className="home-card-title">나만의 카페 아카이브</h2>
                        </div>

                        <p className="home-card-desc">
                            방문 날짜, 만족도, 메모를 함께 저장해서<br />
                            다음에 갈 카페를 고를 때 바로 꺼내볼 수 있어요.
                        </p>

                        <ul className="home-card-list">
                            <li>방문 시각과 메모</li>
                            <li>공부 점수, 콘센트, 와이파이 상태</li>
                            <li>닉네임으로 내 기록 구분</li>
                        </ul>
                    </article>

                    <article className="home-card">
                        <div className="home-card-header">
                            <span className="home-card-tag home-card-tag--map">지도</span>
                            <h2 className="home-card-title">지도에서 한눈에</h2>
                        </div>

                        <p className="home-card-desc">
                            등록한 카페를 지도 위에 보여줘서<br />
                            근처에 공부하기 좋은 카페를 빠르게 찾을 수 있어요.
                        </p>

                        <ul className="home-card-list">
                            <li>만족도별 색상 표시</li>
                            <li>콘센트, 와이파이 필터</li>
                            <li>여러 사용자의 기록 함께 보기</li>
                        </ul>
                    </article>
                </section>
            </main>
        </div>
    );
}