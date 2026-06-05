package com.smartvillage.governance.controllers;

import com.smartvillage.governance.dto.GrievanceAssignRequest;
import com.smartvillage.governance.dto.GrievanceDTO;
import com.smartvillage.governance.dto.GrievanceStatusRequest;
import com.smartvillage.governance.models.Grievance;
import com.smartvillage.governance.models.Role;
import com.smartvillage.governance.models.User;
import com.smartvillage.governance.repositories.UserRepository;
import com.smartvillage.governance.services.GrievanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grievances")
public class GrievanceController {

    private final GrievanceService grievanceService;
    private final UserRepository userRepository;

    public GrievanceController(GrievanceService grievanceService, UserRepository userRepository) {
        this.grievanceService = grievanceService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Grievance>> getGrievances(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Session user not found"));

        if (user.getRole() == Role.CITIZEN) {
            // Citizen only sees their own grievances
            return ResponseEntity.ok(grievanceService.getGrievancesByCitizen(user.getId()));
        } else if (user.getRole() == Role.VILLAGE_OFFICER) {
            // Officer sees all, or could see assigned. Let's return all for dashboard, but support filter if wanted.
            return ResponseEntity.ok(grievanceService.getAllGrievances());
        } else {
            // Admin sees all
            return ResponseEntity.ok(grievanceService.getAllGrievances());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGrievanceById(@PathVariable String id, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Session user not found"));

        return grievanceService.getGrievanceById(id)
                .map(g -> {
                    // Citizen can only view their own
                    if (user.getRole() == Role.CITIZEN && !g.getCitizenId().equals(user.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied to this grievance");
                    }
                    return ResponseEntity.ok(g);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createGrievance(@Valid @RequestBody GrievanceDTO dto, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Session user not found"));

        if (user.getRole() != Role.CITIZEN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only citizens can submit grievances");
        }

        try {
            Grievance grievance = grievanceService.createGrievance(dto, user.getId());
            return ResponseEntity.ok(grievance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignGrievance(@PathVariable String id, @Valid @RequestBody GrievanceAssignRequest request) {
        try {
            Grievance grievance = grievanceService.assignGrievance(id, request.getAssignedOfficerId());
            return ResponseEntity.ok(grievance);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @Valid @RequestBody GrievanceStatusRequest request) {
        try {
            Grievance grievance = grievanceService.updateGrievanceStatus(
                    id, request.getStatus(), request.getResolutionNotes()
            );
            return ResponseEntity.ok(grievance);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<?> resolveGrievance(@PathVariable String id, @RequestBody(required = false) String resolutionNotes) {
        try {
            Grievance grievance = grievanceService.updateGrievanceStatus(id, "RESOLVED", resolutionNotes);
            return ResponseEntity.ok(grievance);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
