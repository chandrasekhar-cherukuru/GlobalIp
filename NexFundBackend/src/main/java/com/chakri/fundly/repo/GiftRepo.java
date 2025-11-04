package com.chakri.fundly.repo;

import com.chakri.fundly.model.Gift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GiftRepo extends JpaRepository<Gift, String> {

    List<Gift> findByCreatorUsername(String creatorUsername);
    List<Gift> findByTitleContainingIgnoreCase(String title);
}
