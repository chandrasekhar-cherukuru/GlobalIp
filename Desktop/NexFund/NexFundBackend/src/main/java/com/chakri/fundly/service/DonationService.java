package com.chakri.fundly.service;

import com.chakri.fundly.model.Donation;
import com.chakri.fundly.repository.DonationRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonationService {

    private final DonationRepo donationRepo;

    public DonationService(DonationRepo donationRepo) {
        this.donationRepo = donationRepo;
    }

    public Donation createDonation(Donation donation) {
        return donationRepo.save(donation);
    }

    public List<Donation> getAllDonations() {
        return donationRepo.findAll();
    }

    public Optional<Donation> getDonationById(String id) {
        return donationRepo.findById(id);
    }

    public void deleteDonation(String id) {
        donationRepo.deleteById(id);
    }
}
