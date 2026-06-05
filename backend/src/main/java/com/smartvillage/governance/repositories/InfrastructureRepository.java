package com.smartvillage.governance.repositories;

import com.smartvillage.governance.models.Infrastructure;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface InfrastructureRepository extends MongoRepository<Infrastructure, String> {
    List<Infrastructure> findByAssetType(String assetType);
    List<Infrastructure> findByStatus(String status);
}
