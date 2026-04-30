package com.mysite.cafe.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 사용자 표시용 닉네임 (로그인 기능 없이도 사용 가능)
    @Column(nullable = false, length = 50)
    private String nickname;
}
