package com.smartvillage.governance.controllers;

import com.smartvillage.governance.dto.CitizenDTO;
import com.smartvillage.governance.models.Citizen;
import com.smartvillage.governance.services.CitizenService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citizens")
public class CitizenController {

    private final CitizenService citizenService;

    public CitizenController(CitizenService citizenService) {
        this.citizenService = citizenService;
    }

    @GetMapping
    public ResponseEntity<List<Citizen>> getAllCitizens(@RequestParam(required = false) String name) {
        if (name != null && !name.trim().isEmpty()) {
            return ResponseEntity.ok(citizenService.searchCitizensByName(name));
        }
        return ResponseEntity.ok(citizenService.getAllCitizens());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCitizenById(@PathVariable String id) {
        return citizenService.getCitizenById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createCitizen(@Valid @RequestBody CitizenDTO dto) {
        try {
            Citizen citizen = citizenService.createCitizen(dto);
            return ResponseEntity.ok(citizen);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCitizen(@PathVariable String id, @Valid @RequestBody CitizenDTO dto) {
        try {
            Citizen citizen = citizenService.updateCitizen(id, dto);
            return ResponseEntity.ok(citizen);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCitizen(@PathVariable String id) {
        try {
            citizenService.deleteCitizen(id);
            return ResponseEntity.ok("Citizen record deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
