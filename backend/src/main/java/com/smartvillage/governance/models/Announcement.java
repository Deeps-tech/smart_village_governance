package com.smartvillage.governance.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "announcements")
public class Announcement {

    @Id
    private String id;

    @Indexed
    private String title;

    private String content;

    private String type; // PUBLIC, EMERGENCY, EVENT

    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    private String postedBy;

    private boolean active = true;

    public Announcement() {
        this.createdAt = LocalDateTime.now();
    }

    public Announcement(String title, String content, String type, LocalDateTime expiresAt, String postedBy) {
        this.title = title;
        this.content = content;
        this.type = type;
        this.expiresAt = expiresAt;
        this.postedBy = postedBy;
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(String postedBy) {
        this.postedBy = postedBy;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
