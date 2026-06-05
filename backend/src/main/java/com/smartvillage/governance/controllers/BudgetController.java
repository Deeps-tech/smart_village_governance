package com.smartvillage.governance.controllers;

import com.smartvillage.governance.dto.BudgetDTO;
import com.smartvillage.governance.dto.TransactionDTO;
import com.smartvillage.governance.models.Budget;
import com.smartvillage.governance.services.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets(@RequestParam(required = false) String financialYear) {
        if (financialYear != null && !financialYear.trim().isEmpty()) {
            return ResponseEntity.ok(budgetService.getBudgetsByYear(financialYear));
        }
        return ResponseEntity.ok(budgetService.getAllBudgets());
    }

    @PostMapping
    public ResponseEntity<?> addBudget(@Valid @RequestBody BudgetDTO dto) {
        try {
            Budget budget = budgetService.addBudget(dto);
            return ResponseEntity.ok(budget);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/transactions")
    public ResponseEntity<?> addTransaction(@PathVariable String id, @Valid @RequestBody TransactionDTO dto) {
        try {
            Budget budget = budgetService.addTransaction(id, dto);
            return ResponseEntity.ok(budget);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/report")
    public ResponseEntity<Map<String, Object>> generateReport() {
        return ResponseEntity.ok(budgetService.generateGlobalReport());
    }
}
