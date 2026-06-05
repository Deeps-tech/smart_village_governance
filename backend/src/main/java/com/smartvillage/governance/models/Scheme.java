package com.smartvillage.governance.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "schemes")
public class Scheme {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private String description;

    private String eligibilityCriteria;

    private double allocatedBudget;

    private LocalDate launchDate;

    private String status = "ACTIVE"; // ACTIVE, CLOSED

    private List<Applicant> applicants = new ArrayList<>();

    public static class Applicant {
        private String userId;
        private String citizenName;
        private LocalDateTime appliedDate = LocalDateTime.now();
        private String status = "PENDING"; // PENDING, APPROVED, REJECTED
        private String remarks;

        public Applicant() {
        }

        public Applicant(String userId, String citizenName, String status, String remarks) {
            this.userId = userId;
            this.citizenName = citizenName;
            this.status = status;
            this.remarks = remarks;
            this.appliedDate = LocalDateTime.now();
        }

        // Getters and Setters
        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getCitizenName() {
            return citizenName;
        }

        public void setCitizenName(String citizenName) {
            this.citizenName = citizenName;
        }

        public LocalDateTime getAppliedDate() {
            return appliedDate;
        }

        public void setAppliedDate(LocalDateTime appliedDate) {
            this.appliedDate = appliedDate;
        }

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

    public Scheme() {
    }

    public Scheme(String name, String description, String eligibilityCriteria, double allocatedBudget, LocalDate launchDate) {
        this.name = name;
        this.description = description;
        this.eligibilityCriteria = eligibilityCriteria;
        this.allocatedBudget = allocatedBudget;
        this.launchDate = launchDate;
        this.status = "ACTIVE";
        this.applicants = new ArrayList<>();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public List<Applicant> getApplicants() {
        return applicants;
    }

    public void setApplicants(List<Applicant> applicants) {
        this.applicants = applicants;
    }
}
