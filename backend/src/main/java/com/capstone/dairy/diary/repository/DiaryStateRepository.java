package com.capstone.dairy.diary.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.capstone.dairy.diary.model.DiaryState;

public interface DiaryStateRepository extends JpaRepository<DiaryState, Long> {
}
