package com.smartvillage.governance.dto;

import jakarta.validation.constraints.NotBlank;

public class SchemeApplyRequest {

    @NotBlank(message = "Citizen name is required")
    private String citizenName;

    private String remarks;

    public String getCitizenName() {
        return citizenName;
    }

    public void setCitizenName(String citizenName) {
        this.citizenName = citizenName;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
