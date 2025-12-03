package com.chakri.fundly.controller;

import com.chakri.fundly.model.Donation;
import com.chakri.fundly.service.DonationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donations")
@CrossOrigin(origins = "http://localhost:3000")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping("/create")
    public ResponseEntity<Donation> createDonation(@RequestBody Donation donation) {
        Donation saved = donationService.createDonation(donation);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public List<Donation> getAllDonations() {
        return donationService.getAllDonations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donation> getDonationById(@PathVariable String id) {
        return donationService.getDonationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonation(@PathVariable String id) {
        donationService.deleteDonation(id);
        return ResponseEntity.noContent().build();
    }
}
