package com.example.backend.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private boolean success = true;
    private UserDto user;
    
    public AuthResponse(String id, String name, String email, String profileImage) {
        this.user = new UserDto(id, name, email, profileImage);
    }
}
