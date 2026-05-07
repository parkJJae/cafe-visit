# 카공맵 Backend

> Spring Boot 기반 카페 방문 기록 API 서버

<br>

## 📌 개요

카공맵 백엔드는 **비회원 기반 카페 방문 기록 서비스**의 API 서버입니다.
JWT/OAuth 같은 인증 시스템 대신 **닉네임 기반 비회원 모델**로 진입 장벽을 최소화하는 데 집중했습니다.

이 문서에서는 단순히 "무엇을 만들었는지"가 아니라, **어떤 고민을 거쳐 지금의 구조에 도달했는지**를 중심으로 설명합니다.

<br>

## 🛠 기술 스택

| 영역 | 기술 |
|---|---|
| Framework | Spring Boot 3 (4.0) |
| Language | Java 17 |
| ORM | Spring Data JPA + Hibernate |
| DB | H2 (dev) / MySQL (prod) |
| Build | Gradle |
| 기타 | Lombok, Bean Validation, JPA Auditing |

<br>

##  아키텍처

<p align="center">
  <img src="https://github.com/user-attachments/assets/91a245ef-330a-4cfb-ad2d-9bfdb7e17579" alt="카공맵 시스템 아키텍처" width="780"/>
</p>

백엔드는 **Controller → Service → Repository**의 전형적인 3-Layer 구조를 따르되, 다음과 같은 보조 컴포넌트를 두어 책임을 명확히 분리했습니다.

- **`ApiResponse<T>`** — 모든 API 응답 포맷 통일
- **`GlobalExceptionHandler`** — `ResponseStatusException` 일괄 처리
- **`BaseEntity` + JPA Auditing** — `createdAt`, `updatedAt` 자동 관리

<br>

## 패키지 구조

```
src/main/java/com/example/cagongmap
├── domain/
│   ├── cafevisit/           # 카페 방문 기록 도메인
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   └── dto/
│   └── user/                # 사용자(닉네임) 도메인
│       └── entity/
└── global/
    ├── common/              # ApiResponse 등 공통 응답
    ├── config/              # JPA Auditing 등 설정
    ├── entity/              # BaseEntity (createdAt/updatedAt)
    └── exception/           # GlobalExceptionHandler
```

**도메인 기반 패키지 구조**를 채택했습니다. 초기에는 `controller/`, `service/`, `repository/`로 계층별 분리를 했는데, 도메인이 커질수록 한 도메인의 변경이 여러 폴더를 건드려야 해서 응집도가 떨어졌습니다. 도메인 단위로 묶으니 하나의 기능을 수정할 때 한 폴더만 보면 되어 인지 부하가 줄었습니다.

<br>

## 리팩토링 스토리

처음 프로젝트는 컨트롤러에 모든 로직이 몰려 있는 형태였습니다. 동작은 하지만 유지보수가 어려운 상태였고, 다음과 같이 단계적으로 리팩토링했습니다.

### 1️. 엔티티 — Setter 제거 + Builder 패턴

**Before**
```java
CafeVisit cafe = new CafeVisit();
cafe.setName(name);
cafe.setLat(lat);
cafe.setLng(lng);
// ... 의도하지 않은 변경 가능
```

**After**
```java
CafeVisit cafe = CafeVisit.builder()
    .name(name)
    .lat(lat)
    .lng(lng)
    .build();
```

Setter는 객체의 변경 시점을 추적하기 어렵게 만들고 불완전한 상태의 객체를 생성할 수 있습니다. **`@Builder`로 생성 시점에 모든 필드를 명시**하도록 강제하고, 와이파이 속도처럼 정해진 값은 `WifiSpeed` Enum으로 관리해 타입 안전성을 확보했습니다.

### 2️. Service 레이어 도입

비즈니스 로직이 컨트롤러에 있으면 트랜잭션 경계가 모호해지고, 컨트롤러가 HTTP 책임 외의 일을 떠안게 됩니다.
**Controller는 요청/응답 변환만, Service는 비즈니스 로직만** 담당하도록 분리했습니다.

### 3️. 공통 응답 + 전역 예외 처리

API 응답 형태가 엔드포인트마다 달라지는 문제를 `ApiResponse<T>`로 통일했습니다.

```java
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}
```

또한 `GlobalExceptionHandler`에서 `ResponseStatusException`을 일괄 처리해, 서비스 레이어에서는 비즈니스 흐름에만 집중할 수 있게 했습니다.

### 4️. JPA Auditing — BaseEntity

`createdAt`, `updatedAt` 같은 메타 필드는 모든 엔티티가 가지지만, 매번 수동으로 관리하면 누락되기 쉽습니다.
**BaseEntity를 만들고 `@MappedSuperclass`로 상속**, JPA Auditing(`@CreatedDate`, `@LastModifiedDate`)으로 자동 관리하도록 했습니다.

### 5️. 환경별 DB 분리

- `application-dev.yml` → H2 인메모리 + 시드 데이터 (`data.sql` 자동 로드)
- `application-prod.yml` → MySQL + 환경변수 주입 (`${DB_URL}`, `${DB_USERNAME}`, `${DB_PASSWORD}`)

운영 DB 정보를 코드에 박지 않고, EC2 배포 시 환경변수로만 주입되도록 분리했습니다.

<br>

## 트러블슈팅

### #1 카페 목록 조회의 N+1 문제

> **증상**: 카페 5개 조회 시 SQL 6번 실행
> **원인**: `@ManyToOne(LAZY)` + DTO 변환 시 연관 엔티티 접근
> **해결**: `LEFT JOIN FETCH`로 1번으로 감소 (6배 ↓)

DTO 변환 시 `cafe.getUser().getNickname()`을 호출하는 순간, 카페마다 LAZY 로딩이 발동해 추가 쿼리가 발생하고 있었습니다. 데이터가 적을 땐 체감이 없지만 카페 수에 비례해 선형 증가하는 구조라 미리 해결했습니다.

`INNER JOIN`이 아닌 **`LEFT JOIN FETCH`를 선택한 이유**는, 비회원이 등록한 카페(`user = null`)도 조회 결과에 포함되어야 하기 때문입니다.

```java
@Query("SELECT c FROM CafeVisit c LEFT JOIN FETCH c.user")
List<CafeVisit> findAllWithUser();
```

상세한 발견 과정과 해결 흐름은 별도 글로 정리했습니다.

📝 **[N+1 문제를 발견하고 해결한 이야기 (Velog)](https://velog.io/@qwg2825/N1-%EB%AC%B8%EC%A0%9C%EB%A5%BC-%EB%B0%9C%EA%B2%AC%ED%95%98%EA%B3%A0-%ED%95%B4%EA%B2%B0%ED%95%9C-%EC%9D%B4%EC%95%BC%EA%B8%B0)**

<br>

## API 명세

| Method | Endpoint | 설명 |
|---|---|---|
| `GET` | `/api/cafe-visits` | 전체 카페 방문 기록 조회 |
| `GET` | `/api/cafe-visits/{id}` | 단일 카페 방문 기록 조회 |
| `POST` | `/api/cafe-visits` | 카페 방문 기록 등록 |
| `PUT` | `/api/cafe-visits/{id}` | 카페 방문 기록 수정 |
| `DELETE` | `/api/cafe-visits/{id}` | 카페 방문 기록 삭제 |

모든 응답은 `ApiResponse<T>` 형태로 통일됩니다.

```json
{
  "success": true,
  "message": "조회 성공",
  "data": [ ... ]
}
```

### PUT/DELETE는 왜 만들었는데 프론트에서 안 쓰는가?

> 카공맵은 비회원 모델이라 "본인이 작성한 기록"을 식별할 방법이 없습니다.
> 누구나 다른 사람의 기록을 수정/삭제할 수 있게 되면 데이터 신뢰성이 무너지므로, **프론트에서는 의도적으로 수정/삭제 UI를 노출하지 않았습니다.**
>
> 다만 PUT/DELETE API는 **RESTful 표준에 맞춰 미리 구현**해 두었습니다. 향후 회원 기능 도입 시 작성자 권한 체크 로직만 추가하면 그대로 활용 가능한 구조입니다.

<br>

## 🎯 의사결정 기록

프로젝트를 진행하며 **하지 않기로 결정한 것들**입니다. 모든 기능을 다 구현하기보다, 프로젝트의 핵심 가치(접근성)에 집중하기 위한 의도적 선택입니다.

| 항목 | 결정 | 이유 |
|---|---|---|
| 회원/JWT/OAuth | ❌ 도입 안 함 | 핵심 가치인 "접근성"과 충돌. 닉네임 기반 비회원 모델로 진입 장벽 제거 |
| Bounding Box 쿼리 | ❌ 도입 안 함 | 현재 데이터 규모(수십~수백 건)에서는 전체 조회로 충분. 과도한 최적화 지양 |
| 프론트 수정/삭제 UI | ❌ 도입 안 함 | 비회원 모델에서 작성자 식별 불가. 회원 기능과 함께 도입 예정 |

<br>

