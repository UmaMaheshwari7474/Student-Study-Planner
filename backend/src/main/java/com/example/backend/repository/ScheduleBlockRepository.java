package com.example.backend.repository;

import com.example.backend.entity.ScheduleBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleBlockRepository extends JpaRepository<ScheduleBlock, String> {
    List<ScheduleBlock> findByUserId(String userId);
}
