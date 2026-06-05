package com.smartvillage.governance.dto;

import java.util.Map;

public class DashboardMetricsResponse {

    private long totalCitizens;
    private long activeGrievances;
    private long completedProjects; // Operational infrastructure assets
    private long welfareBeneficiaries; // Count of approved applicants across schemes
    private double totalBudgetAllocated;
    private double totalBudgetUsed;
    private double totalBudgetRemaining;
    private Map<String, Double> budgetUsedByDepartment;
    private Map<String, Long> grievanceStatusCounts;

    public long getTotalCitizens() {
        return totalCitizens;
    }

    public void setTotalCitizens(long totalCitizens) {
        this.totalCitizens = totalCitizens;
    }

    public long getActiveGrievances() {
        return activeGrievances;
    }

    public void setActiveGrievances(long activeGrievances) {
        this.activeGrievances = activeGrievances;
    }

    public long getCompletedProjects() {
        return completedProjects;
    }

    public void setCompletedProjects(long completedProjects) {
        this.completedProjects = completedProjects;
    }

    public long getWelfareBeneficiaries() {
        return welfareBeneficiaries;
    }

    public void setWelfareBeneficiaries(long welfareBeneficiaries) {
        this.welfareBeneficiaries = welfareBeneficiaries;
    }

    public double getTotalBudgetAllocated() {
        return totalBudgetAllocated;
    }

    public void setTotalBudgetAllocated(double totalBudgetAllocated) {
        this.totalBudgetAllocated = totalBudgetAllocated;
    }

    public double getTotalBudgetUsed() {
        return totalBudgetUsed;
    }

    public void setTotalBudgetUsed(double totalBudgetUsed) {
        this.totalBudgetUsed = totalBudgetUsed;
    }

    public double getTotalBudgetRemaining() {
        return totalBudgetRemaining;
    }

    public void setTotalBudgetRemaining(double totalBudgetRemaining) {
        this.totalBudgetRemaining = totalBudgetRemaining;
    }

    public Map<String, Double> getBudgetUsedByDepartment() {
        return budgetUsedByDepartment;
    }

    public void setBudgetUsedByDepartment(Map<String, Double> budgetUsedByDepartment) {
        this.budgetUsedByDepartment = budgetUsedByDepartment;
    }

    public Map<String, Long> getGrievanceStatusCounts() {
        return grievanceStatusCounts;
    }

    public void setGrievanceStatusCounts(Map<String, Long> grievanceStatusCounts) {
        this.grievanceStatusCounts = grievanceStatusCounts;
    }
}
