package com.wep.customermessage;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerMessageRepository extends JpaRepository<CustomerMessage, Long> {

    @Query("SELECT m FROM CustomerMessage m WHERE LOWER(m.customerName) LIKE LOWER(concat('%', :name, '%'))")
    List<CustomerMessage> findByNameContainingIgnoreCase(@Param("name") String name);

    @Query("SELECT m FROM CustomerMessage m")
    List<CustomerMessage> getAllMessages();
}