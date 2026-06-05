package com.smartvillage.governance.repositories;

import com.smartvillage.governance.models.Citizen;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface CitizenRepository extends MongoRepository<Citizen, String> {
    Optional<Citizen> findByAadhaarRef(String aadhaarRef);
    List<Citizen> findByNameContainingIgnoreCase(String name);
    List<Citizen> findByStatus(String status);
}
