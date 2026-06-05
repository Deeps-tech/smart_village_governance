package com.smartvillage.governance.dto;

import jakarta.validation.constraints.NotBlank;

public class GrievanceAssignRequest {

    @NotBlank(message = "Assigned officer ID is required")
    private String assignedOfficerId;

    public String getAssignedOfficerId() {
        return assignedOfficerId;
    }

    public void setAssignedOfficerId(String assignedOfficerId) {
        this.assignedOfficerId = assignedOfficerId;
    }
}
