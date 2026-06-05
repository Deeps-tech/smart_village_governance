package com.smartvillage.governance.services;

import com.smartvillage.governance.dto.DashboardMetricsResponse;
import com.smartvillage.governance.models.Budget;
import com.smartvillage.governance.models.Grievance;
import com.smartvillage.governance.models.Scheme;
import com.smartvillage.governance.repositories.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final CitizenRepository citizenRepository;
    private final GrievanceRepository grievanceRepository;
    private final InfrastructureRepository infrastructureRepository;
    private final SchemeRepository schemeRepository;
    private final BudgetRepository budgetRepository;

    public DashboardService(CitizenRepository citizenRepository, GrievanceRepository grievanceRepository,
                            InfrastructureRepository infrastructureRepository, SchemeRepository schemeRepository,
                            BudgetRepository budgetRepository) {
        this.citizenRepository = citizenRepository;
        this.grievanceRepository = grievanceRepository;
        this.infrastructureRepository = infrastructureRepository;
        this.schemeRepository = schemeRepository;
        this.budgetRepository = budgetRepository;
    }

    public DashboardMetricsResponse getMetrics() {
        DashboardMetricsResponse metrics = new DashboardMetricsResponse();

        // 1. Total Citizens
        metrics.setTotalCitizens(citizenRepository.count());

        // 2. Active Grievances (PENDING or IN_PROGRESS)
        List<Grievance> grievances = grievanceRepository.findAll();
        long activeGrievancesCount = grievances.stream()
                .filter(g -> "PENDING".equals(g.getStatus()) || "IN_PROGRESS".equals(g.getStatus()))
                .count();
        metrics.setActiveGrievances(activeGrievancesCount);

        // Grievance status counts
        Map<String, Long> statusCounts = grievances.stream()
                .collect(Collectors.groupingBy(Grievance::getStatus, Collectors.counting()));
        metrics.setGrievanceStatusCounts(statusCounts);

        // 3. Completed Projects / Operational Infrastructure
        long completedProjects = infrastructureRepository.findAll().stream()
                .filter(asset -> "OPERATIONAL".equals(asset.getStatus()))
                .count();
        metrics.setCompletedProjects(completedProjects);

        // 4. Welfare Beneficiaries (approved scheme applicants)
        long welfareBeneficiariesCount = schemeRepository.findAll().stream()
                .flatMap(scheme -> scheme.getApplicants().stream())
                .filter(app -> "APPROVED".equals(app.getStatus()))
                .count();
        metrics.setWelfareBeneficiaries(welfareBeneficiariesCount);

        // 5. Budget Metrics
        List<Budget> budgets = budgetRepository.findAll();
        double totalAllocated = 0.0;
        double totalUsed = 0.0;
        Map<String, Double> budgetByDept = new HashMap<>();

        for (Budget b : budgets) {
            totalAllocated += b.getAllocatedAmount();
            totalUsed += b.getUsedAmount();
            budgetByDept.put(b.getDepartment(), budgetByDept.getOrDefault(b.getDepartment(), 0.0) + b.getUsedAmount());
        }

        metrics.setTotalBudgetAllocated(totalAllocated);
        metrics.setTotalBudgetUsed(totalUsed);
        metrics.setTotalBudgetRemaining(totalAllocated - totalUsed);
        metrics.setBudgetUsedByDepartment(budgetByDept);

        return metrics;
    }
}
