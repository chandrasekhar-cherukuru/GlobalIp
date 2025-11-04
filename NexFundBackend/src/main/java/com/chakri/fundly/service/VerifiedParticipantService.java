package com.chakri.fundly.service;

import com.chakri.fundly.model.VerifiedParticipant;
import com.chakri.fundly.repo.VerifiedParticipantRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.regex.Pattern;

@Service
@Transactional
public class VerifiedParticipantService {

    private static final Logger logger = LoggerFactory.getLogger(VerifiedParticipantService.class);
    private static final Pattern UTR_PATTERN = Pattern.compile("^[0-9]{12}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    @Autowired
    private VerifiedParticipantRepo participantRepository;

    /**
     * Save a verified participant with validation
     */
    public VerifiedParticipant saveVerifiedParticipant(String fundraiserId, String participantName,
                                                       String utrNumber, BigDecimal amountPaid,
                                                       String email, String fundraiserType,
                                                       String fundraiserTitle, String createdBy) {

        logger.info("Attempting to save verified participant for fundraiser: {}", fundraiserId);

        // Enhanced validation
        validateRequiredFields(fundraiserId, participantName, utrNumber, amountPaid, createdBy);
        validateUtrNumber(utrNumber);
        validateAmount(amountPaid);

        if (email != null && !email.trim().isEmpty()) {
            validateEmail(email);
        }

        // Business Logic: Check for duplicate UTR
        if (participantRepository.existsByFundraiserIdAndUtrNumber(fundraiserId, utrNumber)) {
            logger.warn("Duplicate UTR number {} for fundraiser {}", utrNumber, fundraiserId);
            throw new IllegalArgumentException("UTR number already exists for this fundraiser");
        }

        try {
            // Create and save participant
            VerifiedParticipant participant = new VerifiedParticipant(
                    fundraiserId,
                    participantName.trim(),
                    utrNumber.trim(),
                    amountPaid,
                    email != null ? email.trim() : null,
                    fundraiserType,
                    fundraiserTitle != null ? fundraiserTitle.trim() : null,
                    createdBy
            );

            VerifiedParticipant saved = participantRepository.save(participant);
            logger.info("Successfully saved verified participant with ID: {}", saved.getId());
            return saved;

        } catch (Exception e) {
            logger.error("Error saving verified participant for fundraiser {}: {}", fundraiserId, e.getMessage());
            throw new RuntimeException("Failed to save verified participant", e);
        }
    }

    /**
     * Get all verified participants for a specific fundraiser
     */
    @Transactional(readOnly = true)
    public List<VerifiedParticipant> getParticipantsByFundraiser(String fundraiserId) {
        if (fundraiserId == null || fundraiserId.trim().isEmpty()) {
            throw new IllegalArgumentException("Fundraiser ID is required");
        }

        logger.info("Fetching participants for fundraiser: {}", fundraiserId);
        return participantRepository.findByFundraiserIdOrderByVerifiedAtDesc(fundraiserId);
    }

    /**
     * Get all verified participants for current user's fundraisers
     */
    @Transactional(readOnly = true)
    public List<VerifiedParticipant> getParticipantsByCreator(String createdBy) {
        if (createdBy == null || createdBy.trim().isEmpty()) {
            throw new IllegalArgumentException("Creator username is required");
        }

        logger.info("Fetching participants for creator: {}", createdBy);
        return participantRepository.findByCreatedByOrderByVerifiedAtDesc(createdBy);
    }

    /**
     * Check if UTR number already exists for a fundraiser
     */
    @Transactional(readOnly = true)
    public boolean isUtrDuplicate(String fundraiserId, String utrNumber) {
        if (fundraiserId == null || utrNumber == null) {
            return false;
        }
        return participantRepository.existsByFundraiserIdAndUtrNumber(fundraiserId, utrNumber);
    }

    /**
     * Get participant statistics for a fundraiser
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getParticipantStats(String fundraiserId) {
        if (fundraiserId == null || fundraiserId.trim().isEmpty()) {
            throw new IllegalArgumentException("Fundraiser ID is required");
        }

        logger.info("Fetching stats for fundraiser: {}", fundraiserId);

        Long participantCount = participantRepository.countByFundraiserId(fundraiserId);
        Double totalAmount = participantRepository.getTotalAmountByFundraiserId(fundraiserId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("participantCount", participantCount != null ? participantCount : 0L);
        stats.put("totalAmount", totalAmount != null ? totalAmount : 0.0);

        return stats;
    }

    /**
     * Get total participant count for a fundraiser
     */
    @Transactional(readOnly = true)
    public Long getParticipantCount(String fundraiserId) {
        if (fundraiserId == null || fundraiserId.trim().isEmpty()) {
            return 0L;
        }
        Long count = participantRepository.countByFundraiserId(fundraiserId);
        return count != null ? count : 0L;
    }

    /**
     * Get total amount collected for a fundraiser
     */
    @Transactional(readOnly = true)
    public Double getTotalAmount(String fundraiserId) {
        if (fundraiserId == null || fundraiserId.trim().isEmpty()) {
            return 0.0;
        }
        Double total = participantRepository.getTotalAmountByFundraiserId(fundraiserId);
        return total != null ? total : 0.0;
    }

    /**
     * Delete a verified participant (if needed)
     */
    public void deleteParticipant(String participantId, String createdBy) {
        if (participantId == null || createdBy == null) {
            throw new IllegalArgumentException("Participant ID and creator are required");
        }

        VerifiedParticipant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new IllegalArgumentException("Participant not found"));

        // Business Logic: Only creator can delete
        if (!participant.getCreatedBy().equals(createdBy)) {
            throw new IllegalArgumentException("You can only delete participants from your own fundraisers");
        }

        logger.info("Deleting participant {} by creator {}", participantId, createdBy);
        participantRepository.delete(participant);
    }

    /**
     * Update participant verification status or details (if needed)
     */
    public VerifiedParticipant updateParticipant(String participantId, String createdBy,
                                                 String newName, String newEmail) {
        if (participantId == null || createdBy == null) {
            throw new IllegalArgumentException("Participant ID and creator are required");
        }

        VerifiedParticipant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new IllegalArgumentException("Participant not found"));

        // Business Logic: Only creator can update
        if (!participant.getCreatedBy().equals(createdBy)) {
            throw new IllegalArgumentException("You can only update participants from your own fundraisers");
        }

        boolean updated = false;

        if (newName != null && !newName.trim().isEmpty()) {
            participant.setParticipantName(newName.trim());
            updated = true;
        }

        if (newEmail != null && !newEmail.trim().isEmpty()) {
            validateEmail(newEmail);
            participant.setEmail(newEmail.trim());
            updated = true;
        }

        if (updated) {
            logger.info("Updating participant {} by creator {}", participantId, createdBy);
            return participantRepository.save(participant);
        }

        return participant;
    }

    // Private validation methods
    private void validateRequiredFields(String fundraiserId, String participantName,
                                        String utrNumber, BigDecimal amountPaid, String createdBy) {
        if (fundraiserId == null || fundraiserId.trim().isEmpty()) {
            throw new IllegalArgumentException("Fundraiser ID is required");
        }
        if (participantName == null || participantName.trim().isEmpty()) {
            throw new IllegalArgumentException("Participant name is required");
        }
        if (utrNumber == null || utrNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("UTR number is required");
        }
        if (amountPaid == null) {
            throw new IllegalArgumentException("Amount is required");
        }
        if (createdBy == null || createdBy.trim().isEmpty()) {
            throw new IllegalArgumentException("Creator is required");
        }
    }

    private void validateUtrNumber(String utrNumber) {
        if (!UTR_PATTERN.matcher(utrNumber.trim()).matches()) {
            throw new IllegalArgumentException("UTR number must be exactly 12 digits");
        }
    }

    private void validateAmount(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }
        if (amount.compareTo(new BigDecimal("99999999.99")) > 0) {
            throw new IllegalArgumentException("Amount is too large");
        }
    }

    private void validateEmail(String email) {
        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }
}
