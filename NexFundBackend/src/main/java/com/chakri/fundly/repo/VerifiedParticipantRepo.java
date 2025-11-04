package com.chakri.fundly.repo;

import com.chakri.fundly.model.VerifiedParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerifiedParticipantRepo extends JpaRepository<VerifiedParticipant, String> {

    // 🚨 **MISSING METHOD - ADD THIS**
    List<VerifiedParticipant> findByFundraiserId(String fundraiserId);

    // Find participants ordered by verification date
    List<VerifiedParticipant> findByFundraiserIdOrderByVerifiedAtDesc(String fundraiserId);

    // Find participants by creator
    List<VerifiedParticipant> findByCreatedByOrderByVerifiedAtDesc(String createdBy);

    // Check if UTR exists for fundraiser
    boolean existsByFundraiserIdAndUtrNumber(String fundraiserId, String utrNumber);

    // Count participants by fundraiser
    Long countByFundraiserId(String fundraiserId);

    // Get total amount by fundraiser
    @Query("SELECT SUM(p.amountPaid) FROM VerifiedParticipant p WHERE p.fundraiserId = :fundraiserId")
    Double getTotalAmountByFundraiserId(@Param("fundraiserId") String fundraiserId);
}
