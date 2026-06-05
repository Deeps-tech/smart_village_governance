package com.smartvillage.governance.controllers;

import com.smartvillage.governance.dto.SchemeApplyRequest;
import com.smartvillage.governance.dto.SchemeApprovalRequest;
import com.smartvillage.governance.dto.SchemeDTO;
import com.smartvillage.governance.models.Scheme;
import com.smartvillage.governance.models.User;
import com.smartvillage.governance.repositories.UserRepository;
import com.smartvillage.governance.services.SchemeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
public class SchemeController {

    private final SchemeService schemeService;
    private final UserRepository userRepository;

    public SchemeController(SchemeService schemeService, UserRepository userRepository) {
        this.schemeService = schemeService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Scheme>> getAllSchemes() {
        return ResponseEntity.ok(schemeService.getAllSchemes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSchemeById(@PathVariable String id) {
        return schemeService.getSchemeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createScheme(@Valid @RequestBody SchemeDTO dto) {
        try {
            Scheme scheme = schemeService.createScheme(dto);
            return ResponseEntity.ok(scheme);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<?> applyForScheme(@PathVariable String id, @Valid @RequestBody SchemeApplyRequest request, 
                                            Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Session user not found"));

        try {
            Scheme scheme = schemeService.applyForScheme(id, user.getId(), request.getCitizenName(), request.getRemarks());
            return ResponseEntity.ok(scheme);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/applicants/{userId}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable String id, @PathVariable String userId,
                                                     @Valid @RequestBody SchemeApprovalRequest request) {
        try {
            Scheme scheme = schemeService.updateApplicationStatus(id, userId, request.getStatus(), request.getRemarks());
            return ResponseEntity.ok(scheme);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
