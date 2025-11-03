package com.chakri.fundly.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "final_verified_participants",
        uniqueConstraints = @UniqueConstraint(columnNames = {"participant_id"}))
public class FinalVerifiedParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "participant_id", nullable = false, unique = true)
    private String participantId; // FK to VerifiedParticipant

    @Column(name = "verified_by", nullable = false)
    private String verifiedBy; // Creator username who performed final verification

    @Column(name = "verified_at", nullable = false)
    private LocalDateTime verifiedAt;

    @Column(name = "notes", length = 500)
    private String notes; // Optional notes from creator

    // Default constructor
    public FinalVerifiedParticipant() {
        this.verifiedAt = LocalDateTime.now();
    }

    // Parameterized constructor
    public FinalVerifiedParticipant(String participantId, String verifiedBy) {
        this();
        this.participantId = participantId;
        this.verifiedBy = verifiedBy;
    }

    public FinalVerifiedParticipant(String participantId, String verifiedBy, String notes) {
        this(participantId, verifiedBy);
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getParticipantId() { return participantId; }
    public void setParticipantId(String participantId) { this.participantId = participantId; }

    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    @Override
    public String toString() {
        return "FinalVerifiedParticipant{" +
                "id=" + id +
                ", participantId='" + participantId + '\'' +
                ", verifiedBy='" + verifiedBy + '\'' +
                ", verifiedAt=" + verifiedAt +
                '}';
    }
}
