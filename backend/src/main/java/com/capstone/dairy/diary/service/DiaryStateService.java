package com.capstone.dairy.diary.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.capstone.dairy.diary.dto.DiarySnapshotDto;
import com.capstone.dairy.diary.dto.EntryDto;
import com.capstone.dairy.diary.dto.MilestoneDto;
import com.capstone.dairy.diary.model.DiaryState;
import com.capstone.dairy.diary.repository.DiaryStateRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class DiaryStateService {

    private static final Long STATE_ID = 1L;

    private final DiaryStateRepository diaryStateRepository;
    private final ObjectMapper objectMapper;

    public DiaryStateService(DiaryStateRepository diaryStateRepository, ObjectMapper objectMapper) {
        this.diaryStateRepository = diaryStateRepository;
        this.objectMapper = objectMapper;
    }

    public DiarySnapshotDto getSnapshot() {
        DiaryState state = getOrCreateState();
        DiarySnapshotDto dto = new DiarySnapshotDto();
        dto.entries = readEntries(state.getEntriesJson());
        dto.milestones = readMilestones(state.getMilestonesJson());
        dto.timeLog = readTimeLog(state.getTimeLogJson());
        return dto;
    }

    public List<EntryDto> replaceEntries(List<EntryDto> entries) {
        DiaryState state = getOrCreateState();
        List<EntryDto> safeEntries = entries == null ? new ArrayList<>() : entries;
        state.setEntriesJson(writeJson(safeEntries));
        diaryStateRepository.save(state);
        return safeEntries;
    }

    public List<MilestoneDto> replaceMilestones(List<MilestoneDto> milestones) {
        DiaryState state = getOrCreateState();
        List<MilestoneDto> safeMilestones = milestones == null ? new ArrayList<>() : milestones;
        state.setMilestonesJson(writeJson(safeMilestones));
        diaryStateRepository.save(state);
        return safeMilestones;
    }

    public Map<String, Long> replaceTimeLog(Map<String, Long> timeLog) {
        DiaryState state = getOrCreateState();
        Map<String, Long> safeTimeLog = timeLog == null ? new HashMap<>() : timeLog;
        state.setTimeLogJson(writeJson(safeTimeLog));
        diaryStateRepository.save(state);
        return safeTimeLog;
    }

    private DiaryState getOrCreateState() {
        return diaryStateRepository.findById(STATE_ID).orElseGet(() -> {
            DiaryState state = new DiaryState();
            state.setId(STATE_ID);
            state.setEntriesJson("[]");
            state.setMilestonesJson("[]");
            state.setTimeLogJson("{}");
            return diaryStateRepository.save(state);
        });
    }

    private List<EntryDto> readEntries(String json) {
        String safeJson = (json == null || json.isBlank()) ? "[]" : json;
        try {
            return objectMapper.readValue(safeJson, new TypeReference<List<EntryDto>>() {
            });
        } catch (JsonProcessingException ex) {
            return new ArrayList<>();
        }
    }

    private List<MilestoneDto> readMilestones(String json) {
        String safeJson = (json == null || json.isBlank()) ? "[]" : json;
        try {
            return objectMapper.readValue(safeJson, new TypeReference<List<MilestoneDto>>() {
            });
        } catch (JsonProcessingException ex) {
            return new ArrayList<>();
        }
    }

    private Map<String, Long> readTimeLog(String json) {
        String safeJson = (json == null || json.isBlank()) ? "{}" : json;
        try {
            return objectMapper.readValue(safeJson, new TypeReference<Map<String, Long>>() {
            });
        } catch (JsonProcessingException ex) {
            return new HashMap<>();
        }
    }

    private String writeJson(Object payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Failed to serialize payload", ex);
        }
    }
}
