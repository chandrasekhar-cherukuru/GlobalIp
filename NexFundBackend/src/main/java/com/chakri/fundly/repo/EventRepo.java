package com.chakri.fundly.repo;

import com.chakri.fundly.model.Events;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepo extends JpaRepository<Events, String> {

    List<Events> findByCreatedByUsername(String createdByUsername);
    List<Events> findByEventTitleContainingIgnoreCase(String eventTitle);
    List<Events> findByEventAmountBetween(int minAmount, int maxAmount);
}
