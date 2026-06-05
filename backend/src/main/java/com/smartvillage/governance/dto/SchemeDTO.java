package com.smartvillage.governance.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class SchemeDTO {

    @NotBlank(message = "Scheme name is required")
    private String name;

    @NotBlank(message = "Scheme description is required")
    private String description;

    @NotBlank(message = "Eligibility criteria is required")
    private String eligibilityCriteria;

    @Min(value = 0, message = "Allocated budget must be a positive value")
    private double allocatedBudget;

    @NotNull(message = "Launch date is required")
    private LocalDate launchDate;

    private String status; // ACTIVE, CLOSED

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEligibilityCriteria() {
        return eligibilityCriteria;
    }

    public void setEligibilityCriteria(String eligibilityCriteria) {
        this.eligibilityCriteria = eligibilityCriteria;
    }

    public double getAllocatedBudget() {
        return allocatedBudget;
    }

    public void setAllocatedBudget(double allocatedBudget) {
        this.allocatedBudget = allocatedBudget;
    }

    public LocalDate getLaunchDate() {
        return launchDate;
    }

    public void setLaunchDate(LocalDate launchDate) {
        this.launchDate = launchDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
