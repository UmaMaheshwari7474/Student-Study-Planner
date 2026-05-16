package com.example.backend.controller;

import com.example.backend.dto.UserProfileRequest;
import com.example.backend.dto.UserProfileResponse;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(new UserProfileResponse(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileRequest profileRequest, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return userRepository.findById(userId)
                .map(user -> {
                    if (profileRequest.getName() != null) user.setName(profileRequest.getName());
                    if (profileRequest.getBio() != null) user.setBio(profileRequest.getBio());
                    if (profileRequest.getProfileImage() != null) user.setProfileImage(profileRequest.getProfileImage());
                    userRepository.save(user);
                    return ResponseEntity.ok(new UserProfileResponse(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
