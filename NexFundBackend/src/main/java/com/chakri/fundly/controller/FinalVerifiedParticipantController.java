package com.chakri.fundly.controller;

import com.chakri.fundly.model.FinalVerifiedParticipant;
import com.chakri.fundly.service.FinalVerifiedParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/participants")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5176", "http://localhost:3000"})
public class FinalVerifiedParticipantController {

    private static final Logger logger = LoggerFactory.getLogger(FinalVerifiedParticipantController.class);

    @Autowired
    private FinalVerifiedParticipantService finalVerificationService;

    /**
     * POST - Finally verify a participant
     */
    @PostMapping("/final-verify/{participantId}")
    public ResponseEntity<?> finallyVerifyParticipant(@PathVariable String participantId,
                                                      @RequestBody(required = false) Map<String, String> requestBody,
                                                      Authentication authentication) {
        logger.info("🔄 Final verification request for participant: {} by user: {}", participantId, authentication.getName());

        try {
            String currentUser = authentication.getName();
            String notes = requestBody != null ? requestBody.get("notes") : null;

            logger.info("📝 Verification details - User: {}, Participant: {}, Notes: {}", currentUser, participantId, notes);

            FinalVerifiedParticipant finalVerification = finalVerificationService
                    .finallyVerifyParticipant(participantId, currentUser, notes);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Participant finally verified successfully");
            response.put("participantId", finalVerification.getParticipantId());
            response.put("verifiedBy", finalVerification.getVerifiedBy());
            response.put("verifiedAt", finalVerification.getVerifiedAt());
            response.put("id", finalVerification.getId());

            logger.info("✅ Successfully verified participant: {} by: {} with record ID: {}",
                    participantId, currentUser, finalVerification.getId());
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.error("❌ Validation error for participant {}: {}", participantId, e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            errorResponse.put("participantId", participantId);
            return ResponseEntity.badRequest().body(errorResponse);

        } catch (Exception e) {
            logger.error("❌ Unexpected error verifying participant {}: {}", participantId, e.getMessage(), e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to finally verify participant: " + e.getMessage());
            errorResponse.put("participantId", participantId);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * GET - Check if participant is finally verified
     */
    @GetMapping("/final-verify/check/{participantId}")
    public ResponseEntity<?> checkFinalVerification(@PathVariable String participantId) {
        logger.debug("🔍 Checking final verification status for participant: {}", participantId);

        try {
            boolean isVerified = finalVerificationService.isParticipantFinallyVerified(participantId);

            Map<String, Object> response = new HashMap<>();
            response.put("participantId", participantId);
            response.put("isFinallyVerified", isVerified);

            if (isVerified) {
                finalVerificationService.getFinalVerification(participantId).ifPresent(fv -> {
                    response.put("verifiedBy", fv.getVerifiedBy());
                    response.put("verifiedAt", fv.getVerifiedAt());
                    response.put("notes", fv.getNotes());
                    response.put("id", fv.getId());
                });
                logger.debug("✅ Participant {} is finally verified", participantId);
            } else {
                logger.debug("⏳ Participant {} is not finally verified", participantId);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("❌ Error checking verification status for participant {}: {}", participantId, e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to check verification status", "participantId", participantId));
        }
    }

    /**
     * GET - Get all final verifications for current user's fundraisers
     */
    @GetMapping("/final-verify/my-verifications")
    public ResponseEntity<?> getMyFinalVerifications(Authentication authentication) {
        String currentUser = authentication.getName();
        logger.info("📋 Getting final verifications for user: {}", currentUser);

        try {
            List<FinalVerifiedParticipant> verifications = finalVerificationService
                    .getFinalVerificationsByCreator(currentUser);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", verifications.size());
            response.put("verifications", verifications);

            logger.info("✅ Found {} final verifications for user: {}", verifications.size(), currentUser);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("❌ Error fetching final verifications for user {}: {}", currentUser, e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Failed to fetch final verifications"));
        }
    }

    /**
     * GET - Get final verifications for specific fundraiser
     */
    @GetMapping("/final-verify/fundraiser/{fundraiserId}")
    public ResponseEntity<?> getFinalVerificationsByFundraiser(@PathVariable String fundraiserId) {
        logger.info("📋 Getting final verifications for fundraiser: {}", fundraiserId);

        try {
            List<FinalVerifiedParticipant> verifications = finalVerificationService
                    .getFinalVerificationsByFundraiser(fundraiserId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("fundraiserId", fundraiserId);
            response.put("count", verifications.size());
            response.put("verifications", verifications);

            logger.info("✅ Found {} final verifications for fundraiser: {}", verifications.size(), fundraiserId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("❌ Error fetching verifications for fundraiser {}: {}", fundraiserId, e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "error", "Failed to fetch fundraiser verifications",
                            "fundraiserId", fundraiserId
                    ));
        }
    }

    /**
     * GET - Get final verification statistics for a fundraiser
     */
    @GetMapping("/final-verify/stats/{fundraiserId}")
    public ResponseEntity<?> getFinalVerificationStats(@PathVariable String fundraiserId) {
        logger.info("📊 Getting final verification stats for fundraiser: {}", fundraiserId);

        try {
            Long finalVerificationCount = finalVerificationService.getFinalVerificationCount(fundraiserId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("fundraiserId", fundraiserId);
            response.put("finalVerificationCount", finalVerificationCount != null ? finalVerificationCount : 0);

            logger.info("✅ Final verification stats for fundraiser {}: {} verifications", fundraiserId, finalVerificationCount);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("❌ Error getting stats for fundraiser {}: {}", fundraiserId, e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "error", "Failed to get final verification stats",
                            "fundraiserId", fundraiserId
                    ));
        }
    }

    /**
     * DELETE - Remove final verification
     */
    @DeleteMapping("/final-verify/{participantId}")
    public ResponseEntity<?> removeFinalVerification(@PathVariable String participantId,
                                                     Authentication authentication) {
        String currentUser = authentication.getName();
        logger.info("🗑️ Removing final verification for participant: {} by user: {}", participantId, currentUser);

        try {
            finalVerificationService.removeFinalVerification(participantId, currentUser);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Final verification removed successfully");
            response.put("participantId", participantId);

            logger.info("✅ Successfully removed final verification for participant: {}", participantId);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.error("❌ Validation error removing verification for participant {}: {}", participantId, e.getMessage());

            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage(),
                    "participantId", participantId
            ));
        } catch (Exception e) {
            logger.error("❌ Error removing verification for participant {}: {}", participantId, e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "error", "Failed to remove final verification",
                            "participantId", participantId
                    ));
        }
    }

    /**
     * GET - Bulk check final verification status for multiple participants
     */
    @PostMapping("/final-verify/bulk-check")
    public ResponseEntity<?> bulkCheckFinalVerification(@RequestBody Map<String, List<String>> requestBody) {
        List<String> participantIds = requestBody.get("participantIds");
        logger.info("🔍 Bulk checking final verification for {} participants", participantIds != null ? participantIds.size() : 0);

        try {
            if (participantIds == null || participantIds.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "participantIds list is required"
                ));
            }

            Map<String, Boolean> results = new HashMap<>();
            for (String participantId : participantIds) {
                boolean isVerified = finalVerificationService.isParticipantFinallyVerified(participantId);
                results.put(participantId, isVerified);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("results", results);

            logger.info("✅ Bulk verification check completed for {} participants", participantIds.size());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("❌ Error in bulk verification check: {}", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Failed to perform bulk verification check"));
        }
    }

    /**
     * GET - Health check endpoint for final verification service
     */
    @GetMapping("/final-verify/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "FinalVerifiedParticipantController");
        health.put("timestamp", System.currentTimeMillis());
        health.put("endpoints", List.of(
                "POST /participants/final-verify/{participantId}",
                "GET /participants/final-verify/check/{participantId}",
                "GET /participants/final-verify/my-verifications",
                "GET /participants/final-verify/fundraiser/{fundraiserId}",
                "GET /participants/final-verify/stats/{fundraiserId}",
                "DELETE /participants/final-verify/{participantId}",
                "POST /participants/final-verify/bulk-check",
                "GET /participants/final-verify/health"
        ));

        return ResponseEntity.ok(health);
    }
}
