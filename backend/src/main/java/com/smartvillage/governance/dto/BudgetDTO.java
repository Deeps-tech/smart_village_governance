package com.smartvillage.governance.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class BudgetDTO {

    @NotBlank(message = "Financial year is required (e.g. 2026-2027)")
    private String financialYear;

    @Min(value = 0, message = "Allocated amount must be positive")
    private double allocatedAmount;

    @NotBlank(message = "Department name is required (e.g. INFRASTRUCTURE, SCHEMES, HEALTH, etc.)")
    private String department;

    // Getters and Setters
    public String getFinancialYear() {
        return financialYear;
    }

    public void setFinancialYear(String financialYear) {
        this.financialYear = financialYear;
    }

    public double getAllocatedAmount() {
        return allocatedAmount;
    }

    public void setAllocatedAmount(double allocatedAmount) {
        this.allocatedAmount = allocatedAmount;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
