package com.example.backend.controller;

import com.example.backend.entity.ScheduleBlock;
import com.example.backend.entity.Subject;
import com.example.backend.entity.Task;
import com.example.backend.repository.ScheduleBlockRepository;
import com.example.backend.repository.SubjectRepository;
import com.example.backend.repository.TaskRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalTime;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final TaskRepository taskRepository;
    private final ScheduleBlockRepository scheduleBlockRepository;
    private final SubjectRepository subjectRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        List<Task> tasks = taskRepository.findByUserId(userId);
        List<ScheduleBlock> blocks = scheduleBlockRepository.findByUserId(userId);

        long totalTasks = tasks.size();
        long completedTasks = tasks.stream().filter(Task::isCompleted).count();
        double completionRate = totalTasks > 0 ? (double) completedTasks / totalTasks * 100 : 0;

        double totalHours = 0;
        for (ScheduleBlock block : blocks) {
            try {
                LocalTime start = LocalTime.parse(block.getStartTime());
                LocalTime end = LocalTime.parse(block.getEndTime());
                totalHours += Duration.between(start, end).toMinutes() / 60.0;
            } catch (Exception e) {
                // Ignore parsing errors
            }
        }

        // Mock focus score and mastery for now, or derive from tasks
        int focusScore = 85; 
        double mastery = completionRate * 0.8 + 20; // Derived metric

        return ResponseEntity.ok(new StatsResponse(
            (int) totalHours,
            (int) completionRate,
            focusScore,
            (int) mastery
        ));
    }

    @GetMapping("/weekly")
    public ResponseEntity<?> getWeekly(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        List<Task> tasks = taskRepository.findByUserId(userId);
        
        // Return count of completed tasks per day for last 7 days (mocking for simplicity of demo)
        int[] performance = {40, 70, 45, 90, 65, 80, 50}; // Default/Mock
        
        return ResponseEntity.ok(performance);
    }

    @GetMapping("/distribution")
    public ResponseEntity<?> getDistribution(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        List<ScheduleBlock> blocks = scheduleBlockRepository.findByUserId(userId);
        List<Subject> subjects = subjectRepository.findByUserId(userId);
        
        Map<String, String> subjectNames = subjects.stream()
            .collect(Collectors.toMap(Subject::getId, Subject::getName));
        Map<String, String> subjectColors = subjects.stream()
            .collect(Collectors.toMap(Subject::getId, Subject::getColor));

        Map<String, Double> hoursBySubject = new HashMap<>();
        for (ScheduleBlock block : blocks) {
            try {
                LocalTime start = LocalTime.parse(block.getStartTime());
                LocalTime end = LocalTime.parse(block.getEndTime());
                double hours = Duration.between(start, end).toMinutes() / 60.0;
                hoursBySubject.merge(block.getSubjectId(), hours, Double::sum);
            } catch (Exception e) {}
        }

        double total = hoursBySubject.values().stream().mapToDouble(Double::doubleValue).sum();
        
        List<SubjectDist> dist = new ArrayList<>();
        for (Map.Entry<String, Double> entry : hoursBySubject.entrySet()) {
            int percent = total > 0 ? (int) (entry.getValue() / total * 100) : 0;
            dist.add(new SubjectDist(
                subjectNames.getOrDefault(entry.getKey(), "Unknown"),
                percent,
                subjectColors.getOrDefault(entry.getKey(), "#6366f1")
            ));
        }

        return ResponseEntity.ok(dist);
    }

    @Data
    @AllArgsConstructor
    static class StatsResponse {
        private int studyHours;
        private int tasksCompleted;
        private int focusScore;
        private int subjectMastery;
    }

    @Data
    @AllArgsConstructor
    static class SubjectDist {
        private String name;
        private int percent;
        private String color;
    }
}
