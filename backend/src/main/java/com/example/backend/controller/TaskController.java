package com.example.backend.controller;

import com.example.backend.entity.Task;
import com.example.backend.repository.TaskRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskRepository taskRepository;

    @GetMapping
    public ResponseEntity<List<Task>> getTasks(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(taskRepository.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        task.setUserId(userId);
        return ResponseEntity.ok(taskRepository.save(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody Task updates, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return taskRepository.findByIdAndUserId(id, userId)
                .map(task -> {
                    if (updates.getTitle() != null) task.setTitle(updates.getTitle());
                    if (updates.getSubjectId() != null) task.setSubjectId(updates.getSubjectId());
                    if (updates.getDate() != null) task.setDate(updates.getDate());
                    if (updates.getTime() != null) task.setTime(updates.getTime());
                    if (updates.getType() != null) task.setType(updates.getType());
                    task.setCompleted(updates.isCompleted());
                    if (updates.getPriority() != null) task.setPriority(updates.getPriority());
                    if (updates.getReminders() != null) task.setReminders(updates.getReminders());
                    return ResponseEntity.ok(taskRepository.save(task));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable String id, HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return taskRepository.findByIdAndUserId(id, userId)
                .map(task -> {
                    taskRepository.delete(task);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
