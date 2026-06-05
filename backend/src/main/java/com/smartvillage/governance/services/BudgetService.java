package com.smartvillage.governance.services;

import com.smartvillage.governance.dto.BudgetDTO;
import com.smartvillage.governance.dto.TransactionDTO;
import com.smartvillage.governance.models.Budget;
import com.smartvillage.governance.repositories.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    public List<Budget> getBudgetsByYear(String financialYear) {
        return budgetRepository.findByFinancialYear(financialYear);
    }

    public Budget addBudget(BudgetDTO dto) {
        String dept = dto.getDepartment().toUpperCase();
        
        // Find existing to avoid duplicate allocation in the same year/department
        Budget budget = budgetRepository.findByFinancialYearAndDepartment(dto.getFinancialYear(), dept)
                .orElse(new Budget(dto.getFinancialYear(), dto.getAllocatedAmount(), dept));
        
        // If it exists, update allocated amount
        if (budget.getId() != null) {
            budget.setAllocatedAmount(dto.getAllocatedAmount());
        }

        return budgetRepository.save(budget);
    }

    public Budget addTransaction(String id, TransactionDTO dto) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Budget record not found with ID: " + id));

        Budget.Transaction tx = new Budget.Transaction(
                UUID.randomUUID().toString(),
                dto.getAmount(),
                dto.getDescription(),
                dto.getCategory().toUpperCase()
        );

        budget.addTransaction(tx);
        return budgetRepository.save(budget);
    }

    public Map<String, Object> generateGlobalReport() {
        List<Budget> budgets = budgetRepository.findAll();
        
        double totalAllocated = 0.0;
        double totalUsed = 0.0;
        double totalRemaining = 0.0;
        
        Map<String, Double> deptAllocated = new HashMap<>();
        Map<String, Double> deptUsed = new HashMap<>();

        for (Budget b : budgets) {
            totalAllocated += b.getAllocatedAmount();
            totalUsed += b.getUsedAmount();
            totalRemaining += b.getRemainingAmount();
            
            deptAllocated.put(b.getDepartment(), deptAllocated.getOrDefault(b.getDepartment(), 0.0) + b.getAllocatedAmount());
            deptUsed.put(b.getDepartment(), deptUsed.getOrDefault(b.getDepartment(), 0.0) + b.getUsedAmount());
        }

        Map<String, Object> report = new HashMap<>();
        report.put("totalAllocated", totalAllocated);
        report.put("totalUsed", totalUsed);
        report.put("totalRemaining", totalRemaining);
        report.put("allocatedByDepartment", deptAllocated);
        report.put("usedByDepartment", deptUsed);
        
        return report;
    }
}
