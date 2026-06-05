package com.smartvillage.governance.dto;

import jakarta.validation.constraints.NotBlank;

public class GrievanceStatusRequest {

    @NotBlank(message = "Status is required")
    private String status; // PENDING, IN_PROGRESS, RESOLVED, CLOSED

    private String resolutionNotes;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }
}
