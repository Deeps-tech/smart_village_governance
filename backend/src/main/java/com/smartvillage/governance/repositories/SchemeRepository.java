package com.smartvillage.governance.repositories;

import com.smartvillage.governance.models.Scheme;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface SchemeRepository extends MongoRepository<Scheme, String> {
    Optional<Scheme> findByName(String name);
}
