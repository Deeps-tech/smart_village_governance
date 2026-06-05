package com.smartvillage.governance.services;

import com.smartvillage.governance.dto.GrievanceDTO;
import com.smartvillage.governance.models.Grievance;
import com.smartvillage.governance.repositories.GrievanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GrievanceService {

    private final GrievanceRepository grievanceRepository;

    public GrievanceService(GrievanceRepository grievanceRepository) {
        this.grievanceRepository = grievanceRepository;
    }

    public List<Grievance> getAllGrievances() {
        return grievanceRepository.findAll();
    }

    public List<Grievance> getGrievancesByCitizen(String citizenId) {
        return grievanceRepository.findByCitizenId(citizenId);
    }

    public List<Grievance> getGrievancesByOfficer(String officerId) {
        return grievanceRepository.findByAssignedOfficerId(officerId);
    }

    public Optional<Grievance> getGrievanceById(String id) {
        return grievanceRepository.findById(id);
    }

    public Grievance createGrievance(GrievanceDTO dto, String citizenId) {
        Grievance grievance = new Grievance(
                dto.getTitle(),
                dto.getDescription(),
                dto.getCategory(),
                citizenId,
                dto.getImageUrl()
        );
        return grievanceRepository.save(grievance);
    }

    public Grievance assignGrievance(String id, String officerId) {
        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Grievance not found with ID: " + id));

        grievance.setAssignedOfficerId(officerId);
        if ("PENDING".equals(grievance.getStatus())) {
            grievance.setStatus("IN_PROGRESS");
        }
        return grievanceRepository.save(grievance);
    }

    public Grievance updateGrievanceStatus(String id, String status, String resolutionNotes) {
        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Grievance not found with ID: " + id));

        String upperStatus = status.toUpperCase();
        if (!upperStatus.equals("PENDING") && !upperStatus.equals("IN_PROGRESS") && 
            !upperStatus.equals("RESOLVED") && !upperStatus.equals("CLOSED")) {
            throw new IllegalArgumentException("Invalid status value");
        }

        grievance.setStatus(upperStatus);
        
        if ("RESOLVED".equals(upperStatus) || "CLOSED".equals(upperStatus)) {
            grievance.setResolvedAt(LocalDateTime.now());
            if (resolutionNotes != null) {
                grievance.setResolutionNotes(resolutionNotes);
            }
        }
        
        return grievanceRepository.save(grievance);
    }
}
