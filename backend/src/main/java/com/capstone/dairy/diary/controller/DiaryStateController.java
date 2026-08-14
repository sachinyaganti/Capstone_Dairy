package com.capstone.dairy.diary.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstone.dairy.diary.dto.DiarySnapshotDto;
import com.capstone.dairy.diary.dto.EntryDto;
import com.capstone.dairy.diary.dto.MilestoneDto;
import com.capstone.dairy.diary.service.DiaryStateService;

@RestController
@RequestMapping("/api")
public class DiaryStateController {

    private final DiaryStateService diaryStateService;

    public DiaryStateController(DiaryStateService diaryStateService) {
        this.diaryStateService = diaryStateService;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("ok", true, "service", "diary-backend");
    }

    @GetMapping("/data")
    public DiarySnapshotDto getData() {
        return diaryStateService.getSnapshot();
    }

    @PutMapping("/entries")
    public Map<String, Object> replaceEntries(@RequestBody List<EntryDto> entries) {
        return Map.of("ok", true, "entries", diaryStateService.replaceEntries(entries));
    }

    @PutMapping("/milestones")
    public Map<String, Object> replaceMilestones(@RequestBody List<MilestoneDto> milestones) {
        return Map.of("ok", true, "milestones", diaryStateService.replaceMilestones(milestones));
    }

    @PutMapping("/time-log")
    public Map<String, Object> replaceTimeLog(@RequestBody Map<String, Long> timeLog) {
        return Map.of("ok", true, "timeLog", diaryStateService.replaceTimeLog(timeLog));
    }
}
