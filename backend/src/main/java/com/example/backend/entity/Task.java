package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String subjectId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String date;

    private String time;

    @Column(nullable = false)
    private String type; // exam, assignment, reading

    private boolean completed;

    @Column(nullable = false)
    private String priority; // high, medium, low

    @ElementCollection
    private List<String> reminders;
}
