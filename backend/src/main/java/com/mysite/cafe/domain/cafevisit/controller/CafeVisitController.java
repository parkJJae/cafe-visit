package com.mysite.cafe.domain.cafevisit.controller;

import com.mysite.cafe.domain.cafevisit.dto.CafeVisitRequest;
import com.mysite.cafe.domain.cafevisit.dto.CafeVisitResponse;
import com.mysite.cafe.domain.cafevisit.entity.CafeVisit;
import com.mysite.cafe.domain.user.entity.User;
import com.mysite.cafe.domain.cafevisit.repository.CafeVisitRepository;
import com.mysite.cafe.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/cafes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CafeVisitController {

    private final CafeVisitRepository cafeVisitRepository;
    private final UserRepository userRepository;

    @PostMapping
    public CafeVisitResponse create(@RequestBody CafeVisitRequest req) {

        // 1️닉네임으로 User 조회
        User user = null;
        if (req.nickname() != null && !req.nickname().isBlank()) {
            user = userRepository.findByNickname(req.nickname())
                    .orElseGet(() -> userRepository.save(
                            User.builder()
                                    .nickname(req.nickname())
                                    .build()
                    ));
        }

        // 2️⃣ CafeVisit 엔티티 생성
        CafeVisit entity = new CafeVisit();
        entity.setName(req.name());
        entity.setAddress(req.address());
        entity.setLat(req.lat());
        entity.setLng(req.lng());
        entity.setRating(req.rating());
        entity.setPriceLevel(req.priceLevel());
        entity.setHasOutlet(req.hasOutlet());
        entity.setWifiSpeed(req.wifiSpeed());
        entity.setStudyScore(req.studyScore());
        entity.setMemo(req.memo());
        entity.setVisitedAt(req.visitedAt());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        entity.setUser(user); //  여기서 user 연결

        CafeVisit saved = cafeVisitRepository.save(entity);

        return toResponse(saved);
    }

    @GetMapping
    public List<CafeVisitResponse> findAll() {
        return cafeVisitRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private CafeVisitResponse toResponse(CafeVisit v) {
        String nickname = (v.getUser() != null) ? v.getUser().getNickname() : null;

        return new CafeVisitResponse(
                v.getId(),
                v.getName(),
                v.getAddress(),
                v.getLat(),
                v.getLng(),
                v.getRating(),
                v.getPriceLevel(),
                v.getHasOutlet(),
                v.getWifiSpeed(),
                v.getStudyScore(),
                v.getMemo(),
                v.getVisitedAt(),
                nickname
        );
    }
}
