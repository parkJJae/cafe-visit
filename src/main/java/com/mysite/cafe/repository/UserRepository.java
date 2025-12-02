package com.mysite.cafe.repository;

import com.mysite.cafe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 같은 닉네임 유저가 있는지 확인용
    Optional<User> findByNickname(String nickname);
}
