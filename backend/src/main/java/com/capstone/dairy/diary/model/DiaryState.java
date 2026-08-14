package com.capstone.dairy.diary.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "diary_state")
public class DiaryState {

    @Id
    private Long id;

    @Lob
    @Column(name = "entries_json", nullable = false, columnDefinition = "TEXT")
    private String entriesJson;

    @Lob
    @Column(name = "milestones_json", nullable = false, columnDefinition = "TEXT")
    private String milestonesJson;

    @Lob
    @Column(name = "time_log_json", nullable = false, columnDefinition = "TEXT")
    private String timeLogJson;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    public void touch() {
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEntriesJson() {
        return entriesJson;
    }

    public void setEntriesJson(String entriesJson) {
        this.entriesJson = entriesJson;
    }

    public String getMilestonesJson() {
        return milestonesJson;
    }

    public void setMilestonesJson(String milestonesJson) {
        this.milestonesJson = milestonesJson;
    }

    public String getTimeLogJson() {
        return timeLogJson;
    }

    public void setTimeLogJson(String timeLogJson) {
        this.timeLogJson = timeLogJson;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
