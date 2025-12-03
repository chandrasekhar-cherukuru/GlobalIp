package com.chakri.fundly.repo;

import com.chakri.fundly.model.FinalVerifiedParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FinalVerifiedParticipantRepo extends JpaRepository<FinalVerifiedParticipant, Long> {

    // Check if participant is finally verified
    boolean existsByParticipantId(String participantId);

    // Find final verification by participant ID
    Optional<FinalVerifiedParticipant> findByParticipantId(String participantId);

    // Find all final verifications by verifier
    List<FinalVerifiedParticipant> findByVerifiedByOrderByVerifiedAtDesc(String verifiedBy);

    // 🚨 **ADDED: Find by list of participant IDs**
    List<FinalVerifiedParticipant> findByParticipantIdInOrderByVerifiedAtDesc(List<String> participantIds);

    // Count final verifications by verifier
    Long countByVerifiedBy(String verifiedBy);

    // Delete by participant ID
    void deleteByParticipantId(String participantId);

    // 🚨 **CUSTOM QUERIES FOR FUNDRAISER FILTERING**
    @Query("SELECT fvp FROM FinalVerifiedParticipant fvp " +
            "WHERE fvp.participantId IN " +
            "(SELECT vp.id FROM VerifiedParticipant vp WHERE vp.fundraiserId = :fundraiserId) " +
            "ORDER BY fvp.verifiedAt DESC")
    List<FinalVerifiedParticipant> findByFundraiserIdOrderByVerifiedAtDesc(@Param("fundraiserId") String fundraiserId);

    @Query("SELECT COUNT(fvp) FROM FinalVerifiedParticipant fvp " +
            "WHERE fvp.participantId IN " +
            "(SELECT vp.id FROM VerifiedParticipant vp WHERE vp.fundraiserId = :fundraiserId)")
    Long countByFundraiserId(@Param("fundraiserId") String fundraiserId);
}
