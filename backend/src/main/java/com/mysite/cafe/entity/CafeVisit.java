package com.mysite.cafe.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cafe_visits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CafeVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // 카페 이름
    private String address;     // 주소

    private Double lat;         // 위도
    private Double lng;         // 경도

    private Integer rating;     // 만족도 (1~5)
    private Integer priceLevel; // 가격대 (1~3)

    private Boolean hasOutlet;  // 콘센트 여부
    private String wifiSpeed;   // "FAST", "NORMAL", "SLOW"
    private Integer studyScore; // 공부하기 좋은 정도 (1~5)

    private String memo;        // 메모

    private LocalDateTime visitedAt;   // 방문 시각
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

}
