package com.smartvillage.governance.services;

import com.smartvillage.governance.dto.AnnouncementDTO;
import com.smartvillage.governance.models.Announcement;
import com.smartvillage.governance.repositories.AnnouncementRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    public List<Announcement> getActiveAnnouncements() {
        return announcementRepository.findByActiveTrueOrderByCreatedAtDesc();
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public Optional<Announcement> getAnnouncementById(String id) {
        return announcementRepository.findById(id);
    }

    public Announcement createAnnouncement(AnnouncementDTO dto, String username) {
        LocalDateTime expiry = dto.getExpiresAt();
        if (expiry == null) {
            expiry = LocalDateTime.now().plusDays(7); // Default 7 days expiration
        }

        Announcement announcement = new Announcement(
                dto.getTitle(),
                dto.getContent(),
                dto.getType().toUpperCase(),
                expiry,
                username
        );
        return announcementRepository.save(announcement);
    }

    public Announcement toggleActive(String id, boolean active) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Announcement not found with ID: " + id));

        announcement.setActive(active);
        return announcementRepository.save(announcement);
    }

    public void deleteAnnouncement(String id) {
        if (!announcementRepository.existsById(id)) {
            throw new IllegalArgumentException("Announcement not found with ID: " + id);
        }
        announcementRepository.deleteById(id);
    }
}
