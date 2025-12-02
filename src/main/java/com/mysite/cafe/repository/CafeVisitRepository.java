package com.mysite.cafe.repository;

import com.mysite.cafe.entity.CafeVisit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CafeVisitRepository extends JpaRepository<CafeVisit, Long> {
}
