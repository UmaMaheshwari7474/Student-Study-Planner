package com.example.backend.controller;

import com.example.backend.entity.ScheduleBlock;
import com.example.backend.repository.ScheduleBlockRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleBlockRepository scheduleBlockRepository;

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("hello");
    }

    @GetMapping
    public ResponseEntity<List<ScheduleBlock>> getCalendar(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(scheduleBlockRepository.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<ScheduleBlock> createScheduleBlock(@RequestBody ScheduleBlock block, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        block.setUserId(userId);
        return ResponseEntity.ok(scheduleBlockRepository.save(block));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteScheduleBlock(@PathVariable String id, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        Optional<ScheduleBlock> block = scheduleBlockRepository.findById(id);
        if (block.isPresent() && block.get().getUserId().equals(userId)) {
            scheduleBlockRepository.delete(block.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
