package com.mysite.cafe.domain.cafevisit.repository;

import com.mysite.cafe.domain.cafevisit.entity.CafeVisit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CafeVisitRepository extends JpaRepository<CafeVisit, Long> {
}
