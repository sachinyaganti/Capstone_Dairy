package com.capstone.dairy.diary.dto;

import java.util.ArrayList;
import java.util.List;

public class EntryDto {
    public String id;
    public String title;
    public String content;
    public String date;
    public String status;
    public String statusSource;
    public Long createdAt;
    public List<DocumentDto> documents = new ArrayList<>();
}
