package com.smartvillage.governance.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "citizens")
public class Citizen {

    @Id
    private String id;

    @Indexed
    private String name;

    private String email;

    private String phone;

    @Indexed(unique = true)
    private String aadhaarRef;

    private String occupation;

    private String gender;

    private LocalDate dateOfBirth;

    private String familyHeadId;

    private String relationshipToHead;

    private String address;

    private String status = "ACTIVE"; // ACTIVE, INACTIVE

    public Citizen() {
    }

    public Citizen(String name, String email, String phone, String aadhaarRef, String occupation, 
                   String gender, LocalDate dateOfBirth, String familyHeadId, String relationshipToHead, 
                   String address) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.aadhaarRef = aadhaarRef;
        this.occupation = occupation;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.familyHeadId = familyHeadId;
        this.relationshipToHead = relationshipToHead;
        this.address = address;
        this.status = "ACTIVE";
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAadhaarRef() {
        return aadhaarRef;
    }

    public void setAadhaarRef(String aadhaarRef) {
        this.aadhaarRef = aadhaarRef;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getFamilyHeadId() {
        return familyHeadId;
    }

    public void setFamilyHeadId(String familyHeadId) {
        this.familyHeadId = familyHeadId;
    }

    public String getRelationshipToHead() {
        return relationshipToHead;
    }

    public void setRelationshipToHead(String relationshipToHead) {
        this.relationshipToHead = relationshipToHead;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
