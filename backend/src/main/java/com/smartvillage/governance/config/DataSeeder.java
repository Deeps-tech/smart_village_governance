package com.smartvillage.governance.config;

import com.smartvillage.governance.models.*;
import com.smartvillage.governance.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CitizenRepository citizenRepository;
    private final GrievanceRepository grievanceRepository;
    private final SchemeRepository schemeRepository;
    private final InfrastructureRepository infrastructureRepository;
    private final BudgetRepository budgetRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, CitizenRepository citizenRepository,
                      GrievanceRepository grievanceRepository, SchemeRepository schemeRepository,
                      InfrastructureRepository infrastructureRepository, BudgetRepository budgetRepository,
                      AnnouncementRepository announcementRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.citizenRepository = citizenRepository;
        this.grievanceRepository = grievanceRepository;
        this.schemeRepository = schemeRepository;
        this.infrastructureRepository = infrastructureRepository;
        this.budgetRepository = budgetRepository;
        this.announcementRepository = announcementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Users
        if (userRepository.count() == 0) {
            User admin = new User(
                    "admin",
                    passwordEncoder.encode("password123"),
                    "sarpanch@gramsWARAJ.gov.in",
                    Role.SUPER_ADMIN,
                    "VILL-001"
            );
            User officer = new User(
                    "officer",
                    passwordEncoder.encode("password123"),
                    "officer@gramsWARAJ.gov.in",
                    Role.VILLAGE_OFFICER,
                    "VILL-001"
            );
            User citizenUser = new User(
                    "citizen",
                    passwordEncoder.encode("password123"),
                    "citizen@gramsWARAJ.gov.in",
                    Role.CITIZEN,
                    "VILL-001"
            );

            userRepository.saveAll(Arrays.asList(admin, officer, citizenUser));
            System.out.println("Seeded default users: admin/password123 (SUPER_ADMIN), officer/password123 (VILLAGE_OFFICER), citizen/password123 (CITIZEN)");
        }

        // 2. Seed Citizens
        if (citizenRepository.count() == 0) {
            Citizen citizen1 = new Citizen(
                    "Aarav Patel",
                    "aarav.p@gmail.com",
                    "9876543210",
                    "1234-5678-9988",
                    "Agriculture",
                    "MALE",
                    LocalDate.of(1992, 4, 15),
                    null,
                    "Self",
                    "Panchayat Ward 1, Pipili, Odisha"
            );
            Citizen citizen2 = new Citizen(
                    "Priya Sharma",
                    "priya.s@gmail.com",
                    "9876543211",
                    "1234-5678-7766",
                    "Education",
                    "FEMALE",
                    LocalDate.of(1995, 8, 22),
                    null,
                    "Self",
                    "Ward 2, Pipili, Odisha"
            );
            Citizen citizen3 = new Citizen(
                    "Rajesh Kumar",
                    "rajesh.k@gmail.com",
                    "9876543212",
                    "1234-5678-5544",
                    "Business",
                    "MALE",
                    LocalDate.of(1980, 11, 5),
                    null,
                    "Self",
                    "Main Bazaar, Pipili, Odisha"
            );

            Citizen savedHead = citizenRepository.save(citizen3);

            Citizen citizen4 = new Citizen(
                    "Sunita Devi",
                    "sunita.d@gmail.com",
                    "9876543213",
                    "1234-5678-3322",
                    "Homemaker",
                    "FEMALE",
                    LocalDate.of(1983, 2, 14),
                    savedHead.getId(),
                    "Spouse",
                    "Main Bazaar, Pipili, Odisha"
            );

            citizenRepository.saveAll(Arrays.asList(citizen1, citizen2, citizen4));
            System.out.println("Seeded 4 sample citizens in database");
        }

        // 3. Seed Grievances
        if (grievanceRepository.count() == 0) {
            // Find a citizen and an officer for mappings
            String citizenId = userRepository.findByUsername("citizen")
                    .map(User::getId)
                    .orElse("mock-citizen-id");
            String officerId = userRepository.findByUsername("officer")
                    .map(User::getId)
                    .orElse("mock-officer-id");

            Grievance grievance1 = new Grievance(
                    "Low water pressure in Sector A",
                    "The water pressure in Sector A has been extremely low for the past 5 days. We are only getting water for 15 minutes in the morning.",
                    "Water",
                    citizenId,
                    "https://images.unsplash.com/photo-1542013936693-8848e574047a"
            );
            grievance1.setStatus("PENDING");

            Grievance grievance2 = new Grievance(
                    "Street light damaged near Primary School",
                    "The street light right outside the primary school entrance is broken and has not been working. It gets very dark and unsafe in the evening.",
                    "Electricity",
                    citizenId,
                    "https://images.unsplash.com/photo-1509062522246-3755977927d7"
            );
            grievance2.setStatus("IN_PROGRESS");
            grievance2.setAssignedOfficerId(officerId);

            Grievance grievance3 = new Grievance(
                    "Potholes on the main village road",
                    "There are massive potholes on the main connecting road between Ward 1 and 2. It is causing issues for motorcycles and tractors.",
                    "Road",
                    citizenId,
                    "https://images.unsplash.com/photo-1515162305285-0293e4767cc2"
            );
            grievance3.setStatus("RESOLVED");
            grievance3.setAssignedOfficerId(officerId);
            grievance3.setResolvedAt(LocalDateTime.now().minusDays(1));
            grievance3.setResolutionNotes("Potholes filled with gravel and a concrete layer has been laid out to resolve the issue permanently.");

            grievanceRepository.saveAll(Arrays.asList(grievance1, grievance2, grievance3));
            System.out.println("Seeded 3 sample grievances");
        }

        // 4. Seed Welfare Schemes and Applications
        if (schemeRepository.count() == 0) {
            String citizenId = userRepository.findByUsername("citizen")
                    .map(User::getId)
                    .orElse("mock-citizen-id");

            Scheme scheme1 = new Scheme(
                    "PM Kisan Subsidy Aid",
                    "Financial support of Rs. 6,000 per year in three equal installments to all landholding farmer families across the country.",
                    "Small and marginal farmers owning agricultural land up to 2 hectares.",
                    600000.0,
                    LocalDate.of(2026, 1, 1)
            );

            Scheme.Applicant applicant1 = new Scheme.Applicant(
                    citizenId,
                    "Aarav Patel",
                    "APPROVED",
                    "Documents verified and verified under marginal farmer category."
            );
            scheme1.getApplicants().add(applicant1);

            Scheme scheme2 = new Scheme(
                    "Gramin Awas Yojana",
                    "Provides financial assistance to rural households that are homeless or living in dilapidated houses to construct a permanent house.",
                    "Income below Rs. 1,00,000 per annum and living in kutcha houses.",
                    1200000.0,
                    LocalDate.of(2026, 2, 15)
            );
            
            Scheme.Applicant applicant2 = new Scheme.Applicant(
                    citizenId,
                    "Rajesh Kumar",
                    "PENDING",
                    "Awaiting verification of income certificate."
            );
            scheme2.getApplicants().add(applicant2);

            Scheme scheme3 = new Scheme(
                    "Mukhyamantri Krishi Yojana",
                    "Financial aid and provision of highly subsidized seeds, fertilizers, and agricultural equipment to local village farmers.",
                    "Farming community with land registration in the state registry.",
                    300000.0,
                    LocalDate.of(2026, 3, 1)
            );

            schemeRepository.saveAll(Arrays.asList(scheme1, scheme2, scheme3));
            System.out.println("Seeded 3 welfare schemes and applications");
        }

        // 5. Seed Infrastructure Assets
        if (infrastructureRepository.count() == 0) {
            Infrastructure asset1 = new Infrastructure(
                    "Primary School Tube Well",
                    "WATER_TANKS",
                    "Panchayat School Ground",
                    "OPERATIONAL",
                    4500.0
            );
            Infrastructure asset2 = new Infrastructure(
                    "Panchayat High School Building",
                    "SCHOOLS",
                    "Panchayat Compound, Ward 2",
                    "OPERATIONAL",
                    15000.0
            );
            Infrastructure asset3 = new Infrastructure(
                    "Main Village Road Connection",
                    "ROADS",
                    "Highway intersection to Panchayat Office",
                    "NEEDS_REPAIR",
                    45000.0
            );
            Infrastructure asset4 = new Infrastructure(
                    "Solar Street Light W1",
                    "STREET_LIGHTS",
                    "Ward 1 Main Entrance",
                    "OPERATIONAL",
                    800.0
            );
            Infrastructure asset5 = new Infrastructure(
                    "Sector C Stormwater Drainage",
                    "DRAINAGE",
                    "Sector C Lanes",
                    "UNDER_MAINTENANCE",
                    12000.0
            );

            infrastructureRepository.saveAll(Arrays.asList(asset1, asset2, asset3, asset4, asset5));
            System.out.println("Seeded 5 infrastructure assets");
        }

        // 6. Seed Budgets and Transactions
        if (budgetRepository.count() == 0) {
            Budget budget1 = new Budget("2026-2027", 2000000.0, "INFRASTRUCTURE");
            budget1.addTransaction(new Budget.Transaction(
                    UUID.randomUUID().toString(),
                    15000.0,
                    "High School Repair Work",
                    "DEBIT"
            ));
            budget1.addTransaction(new Budget.Transaction(
                    UUID.randomUUID().toString(),
                    12000.0,
                    "Sector C Drainage Maintenance",
                    "DEBIT"
            ));

            Budget budget2 = new Budget("2026-2027", 1500000.0, "SCHEMES");
            budget2.addTransaction(new Budget.Transaction(
                    UUID.randomUUID().toString(),
                    50000.0,
                    "PM Kisan Subsidy Disbursement Phase 1",
                    "DEBIT"
            ));

            Budget budget3 = new Budget("2026-2027", 500000.0, "HEALTH");
            budget3.addTransaction(new Budget.Transaction(
                    UUID.randomUUID().toString(),
                    15000.0,
                    "Community Vaccination Drive Setup",
                    "DEBIT"
            ));
            budget3.addTransaction(new Budget.Transaction(
                    UUID.randomUUID().toString(),
                    25000.0,
                    "State Grant Allocation",
                    "CREDIT"
            ));

            budgetRepository.saveAll(Arrays.asList(budget1, budget2, budget3));
            System.out.println("Seeded 3 departmental budgets and transactions");
        }

        // 7. Seed Announcements
        if (announcementRepository.count() == 0) {
            Announcement note1 = new Announcement(
                    "Free COVID Booster Vaccination Drive",
                    "A special free booster dose vaccination drive is being organized at the Primary Community Health Center this Saturday from 9 AM to 4 PM. All residents above 18 years are requested to attend. Please bring your Aadhaar Card.",
                    "EMERGENCY",
                    LocalDateTime.now().plusDays(5),
                    "Village Health Committee"
            );

            Announcement note2 = new Announcement(
                    "Gram Sabha Budget Discussion Meeting",
                    "All citizens are cordially invited to attend the quarterly Gram Sabha Meeting on June 15th at 10:00 AM at the Panchayat Bhawan. We will review infrastructure proposals and vote on upcoming budget allocations.",
                    "EVENT",
                    LocalDateTime.now().plusDays(10),
                    "Sarpanch Office"
            );

            Announcement note3 = new Announcement(
                    "Drinking Water Pipeline Repair - Ward 1 & 2",
                    "Please note that the main drinking water pipeline in Ward 1 and 2 will undergo maintenance tomorrow. Water supply will be temporarily suspended between 1:00 PM and 5:00 PM. Please store sufficient water in advance.",
                    "PUBLIC",
                    LocalDateTime.now().plusDays(1),
                    "Water Works Department"
            );

            announcementRepository.saveAll(Arrays.asList(note1, note2, note3));
            System.out.println("Seeded 3 public notices & announcements");
        }
    }
}
