package com.mysite.cafe.dto;

import java.time.LocalDateTime;

public record CafeVisitRequest(
        String name,
        String address,
        Double lat,
        Double lng,
        Integer rating,
        Integer priceLevel,
        Boolean hasOutlet,
        String wifiSpeed,
        Integer studyScore,
        String memo,
        LocalDateTime visitedAt,
        String nickname
) {}
