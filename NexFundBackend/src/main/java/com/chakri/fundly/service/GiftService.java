package com.chakri.fundly.service;

import com.chakri.fundly.model.Gift;
import com.chakri.fundly.repo.GiftRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GiftService {

    private final GiftRepo giftRepo;

    public GiftService(GiftRepo giftRepo) {
        this.giftRepo = giftRepo;
    }

    public Gift createGift(Gift gift) {
        return giftRepo.save(gift);
    }

    public List<Gift> getAllGifts() {
        return giftRepo.findAll();
    }

    public Optional<Gift> getGiftById(String id) {
        return giftRepo.findById(id);
    }

    public void deleteGift(String id) {
        giftRepo.deleteById(id);
    }

    public List<Gift> getGiftsByCreator(String username) {
        return giftRepo.findByCreatorUsername(username);
    }

    public String getUpiId(String giftId) {
        Optional<Gift> gift = giftRepo.findById(giftId);
        return gift.map(Gift::getUpiId).orElse(null);
    }

    public String getUpiMsg(String giftId) {
        Optional<Gift> gift = giftRepo.findById(giftId);
        return gift.map(Gift::getUpiMsg).orElse(null);
    }

    public String getCreatorUsername(String giftId) {
        Optional<Gift> gift = giftRepo.findById(giftId);
        return gift.map(Gift::getCreatorUsername).orElse(null);
    }

    public String getTitle(String giftId) {
        Optional<Gift> gift = giftRepo.findById(giftId);
        return gift.map(Gift::getTitle).orElse(null);
    }
}
