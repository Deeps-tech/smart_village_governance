package com.smartvillage.governance.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "budgets")
public class Budget {

    @Id
    private String id;

    @Indexed
    private String financialYear; // E.g., 2026-2027

    private double allocatedAmount;

    private double usedAmount = 0.0;

    private double remainingAmount;

    @Indexed
    private String department; // INFRASTRUCTURE, SCHEMES, ADMINISTRATION, HEALTH, OTHER

    private List<Transaction> transactions = new ArrayList<>();

    public static class Transaction {
        private String id;
        private double amount;
        private LocalDateTime date;
        private String description;
        private String category; // CREDIT, DEBIT

        public Transaction() {
            this.date = LocalDateTime.now();
        }

        public Transaction(String id, double amount, String description, String category) {
            this.id = id;
            this.amount = amount;
            this.description = description;
            this.category = category;
            this.date = LocalDateTime.now();
        }

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public double getAmount() {
            return amount;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }

        public LocalDateTime getDate() {
            return date;
        }

        public void setDate(LocalDateTime date) {
            this.date = date;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }

    public Budget() {
    }

    public Budget(String financialYear, double allocatedAmount, String department) {
        this.financialYear = financialYear;
        this.allocatedAmount = allocatedAmount;
        this.remainingAmount = allocatedAmount;
        this.department = department;
        this.usedAmount = 0.0;
        this.transactions = new ArrayList<>();
    }

    // Helper method to add transaction and update math
    public void addTransaction(Transaction tx) {
        if (this.transactions == null) {
            this.transactions = new ArrayList<>();
        }
        this.transactions.add(tx);
        if ("DEBIT".equalsIgnoreCase(tx.getCategory())) {
            this.usedAmount += tx.getAmount();
        } else if ("CREDIT".equalsIgnoreCase(tx.getCategory())) {
            this.usedAmount -= tx.getAmount();
        }
        this.remainingAmount = this.allocatedAmount - this.usedAmount;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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
        this.remainingAmount = allocatedAmount - this.usedAmount;
    }

    public double getUsedAmount() {
        return usedAmount;
    }

    public void setUsedAmount(double usedAmount) {
        this.usedAmount = usedAmount;
        this.remainingAmount = this.allocatedAmount - usedAmount;
    }

    public double getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(double remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }
}
