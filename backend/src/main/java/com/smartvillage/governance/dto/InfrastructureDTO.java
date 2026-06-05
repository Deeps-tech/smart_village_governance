package com.smartvillage.governance.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class InfrastructureDTO {

    @NotBlank(message = "Asset name is required")
    private String assetName;

    @NotBlank(message = "Asset type is required (e.g. ROADS, STREET_LIGHTS, WATER_TANKS, DRAINAGE, SCHOOLS)")
    private String assetType;

    @NotBlank(message = "Location details are required")
    private String location;

    @NotBlank(message = "Asset status is required (e.g. OPERATIONAL, UNDER_MAINTENANCE, NEEDS_REPAIR)")
    private String status;

    @Min(value = 0, message = "Maintenance cost must be positive")
    private double maintenanceCost;

    // Getters and Setters
    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public String getAssetType() {
        return assetType;
    }

    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getMaintenanceCost() {
        return maintenanceCost;
    }

    public void setMaintenanceCost(double maintenanceCost) {
        this.maintenanceCost = maintenanceCost;
    }
}
