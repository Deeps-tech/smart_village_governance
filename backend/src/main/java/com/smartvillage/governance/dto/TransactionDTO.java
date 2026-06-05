package com.smartvillage.governance.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class TransactionDTO {

    @Min(value = 0, message = "Transaction amount must be positive")
    private double amount;

    @NotBlank(message = "Transaction description is required")
    private String description;

    @NotBlank(message = "Transaction category is required (CREDIT or DEBIT)")
    private String category; // CREDIT, DEBIT

    // Getters and Setters
    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
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
