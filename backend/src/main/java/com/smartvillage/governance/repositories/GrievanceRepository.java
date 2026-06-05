package com.smartvillage.governance.repositories;

import com.smartvillage.governance.models.Grievance;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GrievanceRepository extends MongoRepository<Grievance, String> {
    List<Grievance> findByCitizenId(String citizenId);
    List<Grievance> findByAssignedOfficerId(String assignedOfficerId);
    List<Grievance> findByStatus(String status);
    List<Grievance> findByCategory(String category);
}
