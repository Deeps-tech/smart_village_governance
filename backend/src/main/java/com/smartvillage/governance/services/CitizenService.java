package com.smartvillage.governance.services;

import com.smartvillage.governance.dto.CitizenDTO;
import com.smartvillage.governance.models.Citizen;
import com.smartvillage.governance.repositories.CitizenRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CitizenService {

    private final CitizenRepository citizenRepository;

    public CitizenService(CitizenRepository citizenRepository) {
        this.citizenRepository = citizenRepository;
    }

    public List<Citizen> getAllCitizens() {
        return citizenRepository.findAll();
    }

    public Optional<Citizen> getCitizenById(String id) {
        return citizenRepository.findById(id);
    }

    public List<Citizen> searchCitizensByName(String name) {
        return citizenRepository.findByNameContainingIgnoreCase(name);
    }

    public Citizen createCitizen(CitizenDTO dto) {
        if (citizenRepository.findByAadhaarRef(dto.getAadhaarRef()).isPresent()) {
            throw new IllegalArgumentException("Citizen with this Aadhaar reference already exists");
        }

        Citizen citizen = new Citizen(
                dto.getName(),
                dto.getEmail(),
                dto.getPhone(),
                dto.getAadhaarRef(),
                dto.getOccupation(),
                dto.getGender(),
                dto.getDateOfBirth(),
                dto.getFamilyHeadId(),
                dto.getRelationshipToHead(),
                dto.getAddress()
        );
        
        if (dto.getStatus() != null) {
            citizen.setStatus(dto.getStatus());
        }

        return citizenRepository.save(citizen);
    }

    public Citizen updateCitizen(String id, CitizenDTO dto) {
        Citizen citizen = citizenRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Citizen record not found with ID: " + id));

        // Check Aadhaar conflict if changed
        if (!citizen.getAadhaarRef().equals(dto.getAadhaarRef())) {
            if (citizenRepository.findByAadhaarRef(dto.getAadhaarRef()).isPresent()) {
                throw new IllegalArgumentException("Citizen with this Aadhaar reference already exists");
            }
            citizen.setAadhaarRef(dto.getAadhaarRef());
        }

        citizen.setName(dto.getName());
        citizen.setEmail(dto.getEmail());
        citizen.setPhone(dto.getPhone());
        citizen.setOccupation(dto.getOccupation());
        citizen.setGender(dto.getGender());
        citizen.setDateOfBirth(dto.getDateOfBirth());
        citizen.setFamilyHeadId(dto.getFamilyHeadId());
        citizen.setRelationshipToHead(dto.getRelationshipToHead());
        citizen.setAddress(dto.getAddress());
        
        if (dto.getStatus() != null) {
            citizen.setStatus(dto.getStatus());
        }

        return citizenRepository.save(citizen);
    }

    public void deleteCitizen(String id) {
        if (!citizenRepository.existsById(id)) {
            throw new IllegalArgumentException("Citizen record not found with ID: " + id);
        }
        citizenRepository.deleteById(id);
    }
}
