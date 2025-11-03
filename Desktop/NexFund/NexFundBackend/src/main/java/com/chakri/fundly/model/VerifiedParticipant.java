package com.chakri.fundly.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "verified_participants",
        uniqueConstraints = @UniqueConstraint(columnNames = {"fundraiser_id", "utr_number"}))
public class VerifiedParticipant {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @Column(name = "fundraiser_id", nullable = false, length = 36)
    private String fundraiserId;

    @Column(name = "participant_name", nullable = false, length = 255)
    private String participantName;

    @Column(name = "utr_number", nullable = false, length = 12)
    private String utrNumber;

    @Column(name = "amount_paid", nullable = false, precision = 10, scale = 2)
    private BigDecimal amountPaid;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "fundraiser_type", length = 50)
    private String fundraiserType;

    @Column(name = "fundraiser_title", length = 500)
    private String fundraiserTitle;

    @Column(name = "verified_at", nullable = false)
    private LocalDateTime verifiedAt;

    @Column(name = "created_by", nullable = false, length = 255)
    private String createdBy;

    // 🚨 ADD MISSING FIELDS
    @Column(name = "payer_username", nullable = false, length = 255)
    private String payerUsername;

    @Column(name = "verified_by", nullable = false, length = 255)
    private String verifiedBy;

    // Default constructor
    public VerifiedParticipant() {
        this.id = UUID.randomUUID().toString();
        this.verifiedAt = LocalDateTime.now();
    }

    // 🚨 UPDATED: Parameterized constructor with ALL fields
    public VerifiedParticipant(String fundraiserId, String participantName, String utrNumber,
                               BigDecimal amountPaid, String email, String fundraiserType,
                               String fundraiserTitle, String createdBy) {
        this();
        this.fundraiserId = fundraiserId;
        this.participantName = participantName;
        this.utrNumber = utrNumber;
        this.amountPaid = amountPaid;
        this.email = email;
        this.fundraiserType = fundraiserType;
        this.fundraiserTitle = fundraiserTitle;
        this.createdBy = createdBy;
        this.payerUsername = participantName; // 🚨 SET payer_username = participant_name
        this.verifiedBy = createdBy; // 🚨 SET verified_by = created_by (same person verifying)
    }

    // All getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFundraiserId() { return fundraiserId; }
    public void setFundraiserId(String fundraiserId) { this.fundraiserId = fundraiserId; }

    public String getParticipantName() { return participantName; }
    public void setParticipantName(String participantName) { this.participantName = participantName; }

    public String getUtrNumber() { return utrNumber; }
    public void setUtrNumber(String utrNumber) { this.utrNumber = utrNumber; }

    public BigDecimal getAmountPaid() { return amountPaid; }
    public void setAmountPaid(BigDecimal amountPaid) { this.amountPaid = amountPaid; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFundraiserType() { return fundraiserType; }
    public void setFundraiserType(String fundraiserType) { this.fundraiserType = fundraiserType; }

    public String getFundraiserTitle() { return fundraiserTitle; }
    public void setFundraiserTitle(String fundraiserTitle) { this.fundraiserTitle = fundraiserTitle; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    // 🚨 NEW: Getters and Setters for missing fields
    public String getPayerUsername() { return payerUsername; }
    public void setPayerUsername(String payerUsername) { this.payerUsername = payerUsername; }

    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }

    @Override
    public String toString() {
        return "VerifiedParticipant{" +
                "id='" + id + '\'' +
                ", fundraiserId='" + fundraiserId + '\'' +
                ", participantName='" + participantName + '\'' +
                ", utrNumber='" + utrNumber + '\'' +
                ", amountPaid=" + amountPaid +
                ", payerUsername='" + payerUsername + '\'' +
                ", verifiedBy='" + verifiedBy + '\'' +
                ", verifiedAt=" + verifiedAt +
                '}';
    }
}
