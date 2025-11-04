package com.chakri.fundly.repo;

import com.chakri.fundly.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublicRepo extends JpaRepository<Event, String> {
}

