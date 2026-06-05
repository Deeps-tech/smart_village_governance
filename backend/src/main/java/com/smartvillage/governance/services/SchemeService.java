package com.smartvillage.governance.services;

import com.smartvillage.governance.dto.SchemeDTO;
import com.smartvillage.governance.models.Scheme;
import com.smartvillage.governance.repositories.SchemeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SchemeService {

    private final SchemeRepository schemeRepository;

    public SchemeService(SchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    public List<Scheme> getAllSchemes() {
        return schemeRepository.findAll();
    }

    public Optional<Scheme> getSchemeById(String id) {
        return schemeRepository.findById(id);
    }

    public Scheme createScheme(SchemeDTO dto) {
        if (schemeRepository.findByName(dto.getName()).isPresent()) {
            throw new IllegalArgumentException("Welfare scheme with this name already exists");
        }

        Scheme scheme = new Scheme(
                dto.getName(),
                dto.getDescription(),
                dto.getEligibilityCriteria(),
                dto.getAllocatedBudget(),
                dto.getLaunchDate()
        );
        return schemeRepository.save(scheme);
    }

    public Scheme applyForScheme(String id, String userId, String citizenName, String remarks) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Welfare scheme not found with ID: " + id));

        // Check if already applied
        boolean alreadyApplied = scheme.getApplicants().stream()
                .anyMatch(a -> a.getUserId().equals(userId));

        if (alreadyApplied) {
            throw new IllegalArgumentException("You have already applied for this scheme");
        }

        Scheme.Applicant applicant = new Scheme.Applicant(userId, citizenName, "PENDING", remarks);
        scheme.getApplicants().add(applicant);
        
        return schemeRepository.save(scheme);
    }

    public Scheme updateApplicationStatus(String id, String userId, String status, String remarks) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Welfare scheme not found with ID: " + id));

        Scheme.Applicant applicant = scheme.getApplicants().stream()
                .filter(a -> a.getUserId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No application found for this citizen"));

        String upperStatus = status.toUpperCase();
        if (!"APPROVED".equals(upperStatus) && !"REJECTED".equals(upperStatus) && !"PENDING".equals(upperStatus)) {
            throw new IllegalArgumentException("Invalid status. Allowed values: APPROVED, REJECTED, PENDING");
        }

        applicant.setStatus(upperStatus);
        if (remarks != null) {
            applicant.setRemarks(remarks);
        }

        return schemeRepository.save(scheme);
    }
}
