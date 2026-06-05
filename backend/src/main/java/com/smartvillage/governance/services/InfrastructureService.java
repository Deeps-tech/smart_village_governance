package com.smartvillage.governance.services;

import com.smartvillage.governance.dto.InfrastructureDTO;
import com.smartvillage.governance.models.Infrastructure;
import com.smartvillage.governance.repositories.InfrastructureRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class InfrastructureService {

    private final InfrastructureRepository infrastructureRepository;

    public InfrastructureService(InfrastructureRepository infrastructureRepository) {
        this.infrastructureRepository = infrastructureRepository;
    }

    public List<Infrastructure> getAllAssets() {
        return infrastructureRepository.findAll();
    }

    public List<Infrastructure> getAssetsByType(String assetType) {
        return infrastructureRepository.findByAssetType(assetType.toUpperCase());
    }

    public Optional<Infrastructure> getAssetById(String id) {
        return infrastructureRepository.findById(id);
    }

    public Infrastructure addAsset(InfrastructureDTO dto) {
        Infrastructure asset = new Infrastructure(
                dto.getAssetName(),
                dto.getAssetType().toUpperCase(),
                dto.getLocation(),
                dto.getStatus().toUpperCase(),
                dto.getMaintenanceCost()
        );
        return infrastructureRepository.save(asset);
    }

    public Infrastructure updateAssetStatus(String id, String status, double maintenanceCost) {
        Infrastructure asset = infrastructureRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Infrastructure asset not found with ID: " + id));

        asset.setStatus(status.toUpperCase());
        asset.setLastInspected(LocalDate.now());
        if (maintenanceCost >= 0) {
            asset.setMaintenanceCost(maintenanceCost);
        }
        return infrastructureRepository.save(asset);
    }
}
