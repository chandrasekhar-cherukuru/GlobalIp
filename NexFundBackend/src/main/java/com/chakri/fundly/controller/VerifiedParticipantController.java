package com.chakri.fundly.controller;

import com.chakri.fundly.model.VerifiedParticipant;
import com.chakri.fundly.repo.VerifiedParticipantRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/participants")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5176", "http://localhost:3000"})
public class VerifiedParticipantController {

    @Autowired
    private VerifiedParticipantRepo participantRepository;

    // **POST - Verify a participant**
    @PostMapping("/verify")
    public ResponseEntity<?> verifyParticipant(@RequestBody Map<String, Object> requestData,
                                               Authentication authentication) {
        try {
            String currentUser = authentication.getName();

            // Extract data from request
            String fundraiserId = (String) requestData.get("fundraiserId");
            String participantName = (String) requestData.get("participantName");
            String utrNumber = (String) requestData.get("utrNumber");
            Double amount = Double.parseDouble(requestData.get("amount").toString());
            String email = (String) requestData.get("email");
            String fundraiserType = (String) requestData.get("fundraiserType");
            String fundraiserTitle = (String) requestData.get("fundraiserTitle");

            // Validation
            if (fundraiserId == null || participantName == null || utrNumber == null || amount <= 0) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }

            // Check for duplicate UTR
            if (participantRepository.existsByFundraiserIdAndUtrNumber(fundraiserId, utrNumber)) {
                return ResponseEntity.badRequest().body("UTR number already exists for this fundraiser");
            }

            // Create and save verified participant
            VerifiedParticipant participant = new VerifiedParticipant(
                    fundraiserId,
                    participantName,
                    utrNumber,
                    BigDecimal.valueOf(amount),
                    email,
                    fundraiserType,
                    fundraiserTitle,
                    currentUser
            );

            VerifiedParticipant saved = participantRepository.save(participant);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Participant verified successfully");
            response.put("participantId", saved.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to verify participant: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // **GET - Get verified participants for a fundraiser**
    @GetMapping("/fundraiser/{fundraiserId}")
    public ResponseEntity<List<VerifiedParticipant>> getParticipantsByFundraiser(
            @PathVariable String fundraiserId, Authentication authentication) {
        try {
            List<VerifiedParticipant> participants = participantRepository
                    .findByFundraiserIdOrderByVerifiedAtDesc(fundraiserId);
            return ResponseEntity.ok(participants);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // **GET - Get all verified participants for current user's fundraisers**
    @GetMapping("/my-fundraisers")
    public ResponseEntity<List<VerifiedParticipant>> getMyFundraiserParticipants(Authentication authentication) {
        try {
            String currentUser = authentication.getName();
            List<VerifiedParticipant> participants = participantRepository
                    .findByCreatedByOrderByVerifiedAtDesc(currentUser);
            return ResponseEntity.ok(participants);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // **GET - Get participant statistics for a fundraiser**
    @GetMapping("/stats/{fundraiserId}")
    public ResponseEntity<Map<String, Object>> getParticipantStats(@PathVariable String fundraiserId) {
        try {
            Long participantCount = participantRepository.countByFundraiserId(fundraiserId);
            Double totalAmount = participantRepository.getTotalAmountByFundraiserId(fundraiserId);

            Map<String, Object> stats = new HashMap<>();
            stats.put("participantCount", participantCount != null ? participantCount : 0);
            stats.put("totalAmount", totalAmount != null ? totalAmount : 0.0);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
