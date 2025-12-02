package com.mysite.cafe.dto;

import java.time.LocalDateTime;

public record CafeVisitResponse(
        Long id,
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
        String registeredBy
) {}
