package com.smartvillage.governance.repositories;

import com.smartvillage.governance.models.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends MongoRepository<Budget, String> {
    Optional<Budget> findByFinancialYearAndDepartment(String financialYear, String department);
    List<Budget> findByFinancialYear(String financialYear);
    List<Budget> findByDepartment(String department);
}
