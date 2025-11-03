package com.chakri.fundly.service;

import com.chakri.fundly.model.FinalVerifiedParticipant;
import com.chakri.fundly.model.VerifiedParticipant;
import com.chakri.fundly.repo.FinalVerifiedParticipantRepo;
import com.chakri.fundly.repo.VerifiedParticipantRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FinalVerifiedParticipantService {

    private static final Logger logger = LoggerFactory.getLogger(FinalVerifiedParticipantService.class);

    @Autowired
    private FinalVerifiedParticipantRepo finalVerifiedRepository;

    @Autowired
    private VerifiedParticipantRepo verifiedParticipantRepository;

    /**
     * Perform final verification of a participant
     */
    public FinalVerifiedParticipant finallyVerifyParticipant(String participantId, String verifiedBy, String notes) {
        logger.info("🔄 Attempting final verification for participant: {} by: {}", participantId, verifiedBy);

        try {
            // Check if participant exists
            VerifiedParticipant participant = verifiedParticipantRepository.findById(participantId)
                    .orElseThrow(() -> {
                        logger.error("❌ Participant not found: {}", participantId);
                        return new IllegalArgumentException("Participant not found with ID: " + participantId);
                    });

            logger.info("✅ Found participant: {} for fundraiser: {}", participant.getParticipantName(), participant.getFundraiserId());

            // 🚨 **REMOVED OWNERSHIP CHECK** - Allow any authenticated user to verify
            logger.info("ℹ️ Allowing verification by user: {} for participant: {} (created by: {})",
                    verifiedBy, participantId, participant.getCreatedBy());

            // Check if already finally verified
            if (finalVerifiedRepository.existsByParticipantId(participantId)) {
                logger.warn("⚠️ Participant {} is already finally verified", participantId);
                throw new IllegalArgumentException("Participant is already finally verified");
            }

            // Create final verification record
            FinalVerifiedParticipant finalVerification = new FinalVerifiedParticipant(
                    participantId,
                    verifiedBy,
                    notes
            );

            FinalVerifiedParticipant saved = finalVerifiedRepository.save(finalVerification);

            logger.info("✅ Successfully finally verified participant: {} by: {} with record ID: {}",
                    participantId, verifiedBy, saved.getId());
            return saved;

        } catch (IllegalArgumentException e) {
            logger.error("❌ Validation error for participant {}: {}", participantId, e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("❌ Unexpected error in final verification for participant {}: {}", participantId, e.getMessage(), e);
            throw new RuntimeException("Failed to perform final verification: " + e.getMessage(), e);
        }
    }

    /**
     * Check if participant is finally verified
     */
    @Transactional(readOnly = true)
    public boolean isParticipantFinallyVerified(String participantId) {
        try {
            boolean isVerified = finalVerifiedRepository.existsByParticipantId(participantId);
            logger.debug("🔍 Participant {} finally verified status: {}", participantId, isVerified);
            return isVerified;
        } catch (Exception e) {
            logger.error("❌ Error checking verification status for participant {}: {}", participantId, e.getMessage());
            return false;
        }
    }

    /**
     * Get final verification details for a participant
     */
    @Transactional(readOnly = true)
    public Optional<FinalVerifiedParticipant> getFinalVerification(String participantId) {
        try {
            Optional<FinalVerifiedParticipant> verification = finalVerifiedRepository.findByParticipantId(participantId);
            logger.debug("🔍 Final verification lookup for participant {}: {}", participantId, verification.isPresent() ? "found" : "not found");
            return verification;
        } catch (Exception e) {
            logger.error("❌ Error getting final verification for participant {}: {}", participantId, e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Get all final verifications by creator
     */
    @Transactional(readOnly = true)
    public List<FinalVerifiedParticipant> getFinalVerificationsByCreator(String verifiedBy) {
        try {
            List<FinalVerifiedParticipant> verifications = finalVerifiedRepository.findByVerifiedByOrderByVerifiedAtDesc(verifiedBy);
            logger.info("📋 Found {} final verifications by creator: {}", verifications.size(), verifiedBy);
            return verifications;
        } catch (Exception e) {
            logger.error("❌ Error getting final verifications by creator {}: {}", verifiedBy, e.getMessage());
            throw new RuntimeException("Failed to fetch final verifications", e);
        }
    }

    /**
     * Get all final verifications for a fundraiser
     * Note: This requires joining with verified_participants to filter by fundraiser
     */
    @Transactional(readOnly = true)
    public List<FinalVerifiedParticipant> getFinalVerificationsByFundraiser(String fundraiserId) {
        try {
            // Get all participants for this fundraiser first
            List<VerifiedParticipant> fundraiserParticipants = verifiedParticipantRepository.findByFundraiserId(fundraiserId);

            // Get participant IDs for this fundraiser
            List<String> participantIds = fundraiserParticipants.stream()
                    .map(VerifiedParticipant::getId)
                    .toList();

            // Get final verifications for these participants
            List<FinalVerifiedParticipant> verifications = finalVerifiedRepository.findByParticipantIdInOrderByVerifiedAtDesc(participantIds);

            logger.info("📋 Found {} final verifications for fundraiser: {}", verifications.size(), fundraiserId);
            return verifications;
        } catch (Exception e) {
            logger.error("❌ Error getting final verifications for fundraiser {}: {}", fundraiserId, e.getMessage());
            throw new RuntimeException("Failed to fetch fundraiser verifications", e);
        }
    }

    /**
     * Get count of finally verified participants for fundraiser
     */
    @Transactional(readOnly = true)
    public Long getFinalVerificationCount(String fundraiserId) {
        try {
            List<FinalVerifiedParticipant> fundraiserVerifications = getFinalVerificationsByFundraiser(fundraiserId);
            long count = fundraiserVerifications.size();
            logger.info("📊 Final verification count for fundraiser {}: {}", fundraiserId, count);
            return count;
        } catch (Exception e) {
            logger.error("❌ Error getting final verification count for fundraiser {}: {}", fundraiserId, e.getMessage());
            return 0L;
        }
    }

    /**
     * Remove final verification (if needed)
     */
    public void removeFinalVerification(String participantId, String verifiedBy) {
        logger.info("🗑️ Attempting to remove final verification for participant {} by {}", participantId, verifiedBy);

        try {
            FinalVerifiedParticipant finalVerification = finalVerifiedRepository.findByParticipantId(participantId)
                    .orElseThrow(() -> new IllegalArgumentException("Final verification not found for participant: " + participantId));

            // 🚨 **OPTIONAL: Remove this check if you want any admin to remove any verification**
            if (!finalVerification.getVerifiedBy().equals(verifiedBy)) {
                logger.warn("⚠️ User {} tried to remove verification made by {}", verifiedBy, finalVerification.getVerifiedBy());
                throw new IllegalArgumentException("You can only remove verifications you performed");
            }

            finalVerifiedRepository.delete(finalVerification);
            logger.info("✅ Successfully removed final verification for participant {} by {}", participantId, verifiedBy);
        } catch (IllegalArgumentException e) {
            logger.error("❌ Validation error removing verification for participant {}: {}", participantId, e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("❌ Error removing final verification for participant {}: {}", participantId, e.getMessage());
            throw new RuntimeException("Failed to remove final verification", e);
        }
    }
}
