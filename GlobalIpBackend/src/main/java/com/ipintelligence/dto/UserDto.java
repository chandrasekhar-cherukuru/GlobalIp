package com.ipintelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class UserDto {
    private Integer id;
    private String username;
    private String email;
    private String role;
    private LocalDateTime createdAt;
}
