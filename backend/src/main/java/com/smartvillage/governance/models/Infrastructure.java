package com.smartvillage.governance.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "infrastructure")
public class Infrastructure {

    @Id
    private String id;

    @Indexed
    private String assetName;

    @Indexed
    private String assetType; // ROADS, STREET_LIGHTS, WATER_TANKS, DRAINAGE, SCHOOLS

    private String location;

    private String status = "OPERATIONAL"; // OPERATIONAL, UNDER_MAINTENANCE, NEEDS_REPAIR

    private LocalDate lastInspected;

    private double maintenanceCost;

    public Infrastructure() {
        this.lastInspected = LocalDate.now();
    }

    public Infrastructure(String assetName, String assetType, String location, String status, double maintenanceCost) {
        this.assetName = assetName;
        this.assetType = assetType;
        this.location = location;
        this.status = status;
        this.maintenanceCost = maintenanceCost;
        this.lastInspected = LocalDate.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public LocalDate getLastInspected() {
        return lastInspected;
    }

    public void setLastInspected(LocalDate lastInspected) {
        this.lastInspected = lastInspected;
    }

    public double getMaintenanceCost() {
        return maintenanceCost;
    }

    public void setMaintenanceCost(double maintenanceCost) {
        this.maintenanceCost = maintenanceCost;
    }
}
