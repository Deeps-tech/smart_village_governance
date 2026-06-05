package com.smartvillage.governance.controllers;

import com.smartvillage.governance.dto.InfrastructureDTO;
import com.smartvillage.governance.models.Infrastructure;
import com.smartvillage.governance.services.InfrastructureService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/infrastructure")
public class InfrastructureController {

    private final InfrastructureService infrastructureService;

    public InfrastructureController(InfrastructureService infrastructureService) {
        this.infrastructureService = infrastructureService;
    }

    @GetMapping
    public ResponseEntity<List<Infrastructure>> getAllAssets(@RequestParam(required = false) String type) {
        if (type != null && !type.trim().isEmpty()) {
            return ResponseEntity.ok(infrastructureService.getAssetsByType(type));
        }
        return ResponseEntity.ok(infrastructureService.getAllAssets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAssetById(@PathVariable String id) {
        return infrastructureService.getAssetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addAsset(@Valid @RequestBody InfrastructureDTO dto) {
        try {
            Infrastructure asset = infrastructureService.addAsset(dto);
            return ResponseEntity.ok(asset);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAssetStatus(@PathVariable String id, @RequestBody Map<String, Object> body) {
        try {
            String status = (String) body.get("status");
            Number costNum = (Number) body.getOrDefault("maintenanceCost", -1.0);
            double maintenanceCost = costNum.doubleValue();

            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Status field is required");
            }

            Infrastructure asset = infrastructureService.updateAssetStatus(id, status, maintenanceCost);
            return ResponseEntity.ok(asset);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
