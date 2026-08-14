package com.capstone.dairy.diary.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DiarySnapshotDto {
    public List<EntryDto> entries = new ArrayList<>();
    public List<MilestoneDto> milestones = new ArrayList<>();
    public Map<String, Long> timeLog = new HashMap<>();
}
