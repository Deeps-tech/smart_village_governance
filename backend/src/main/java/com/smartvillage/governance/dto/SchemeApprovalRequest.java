package com.smartvillage.governance.dto;

import jakarta.validation.constraints.NotBlank;

public class SchemeApprovalRequest {

    @NotBlank(message = "Status is required (APPROVED or REJECTED)")
    private String status; // APPROVED, REJECTED

    private String remarks;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
