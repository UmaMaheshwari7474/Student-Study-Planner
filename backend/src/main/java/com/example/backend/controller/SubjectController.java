package com.example.backend.controller;

import com.example.backend.entity.Subject;
import com.example.backend.repository.SubjectRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectRepository subjectRepository;

    @GetMapping
    public ResponseEntity<List<Subject>> getSubjects(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(subjectRepository.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Subject> createSubject(@RequestBody Subject subject, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        subject.setUserId(userId);
        return ResponseEntity.ok(subjectRepository.save(subject));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(@PathVariable String id, @RequestBody Subject updates, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return subjectRepository.findByIdAndUserId(id, userId)
                .map(subject -> {
                    if (updates.getName() != null) subject.setName(updates.getName());
                    if (updates.getColor() != null) subject.setColor(updates.getColor());
                    return ResponseEntity.ok(subjectRepository.save(subject));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable String id, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return subjectRepository.findByIdAndUserId(id, userId)
                .map(subject -> {
                    subjectRepository.delete(subject);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
