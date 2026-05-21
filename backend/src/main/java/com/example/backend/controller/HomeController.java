package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getHome() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Student Study Planner API");
        response.put("message", "StudyFlow REST API is fully operational.");
        response.put("frontendUrl", "https://student-study-planner-seven.vercel.app");
        return ResponseEntity.ok(response);
    }
}
