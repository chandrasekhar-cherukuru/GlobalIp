package com.chakri.fundly.controller;

import com.chakri.fundly.model.Gift;
import com.chakri.fundly.service.GiftService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gifts")
@CrossOrigin(origins = "http://localhost:3000")
public class GiftController {

    private final GiftService giftService;

    public GiftController(GiftService giftService) {
        this.giftService = giftService;
    }

    @RequestMapping("/")
    public String greet() {
        return "Inside Gift Controller";
    }

    @GetMapping("/allGifts")
    public List<Gift> getGifts() {
        return giftService.getAllGifts();
    }

    @PostMapping("/create")
    public ResponseEntity<Gift> createGift(@RequestBody Gift gift) {
        Gift saved = giftService.createGift(gift);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gift> getGiftById(@PathVariable String id) {
        return giftService.getGiftById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGift(@PathVariable String id) {
        giftService.deleteGift(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/email")
    public ResponseEntity<Void> sendEmail(@RequestBody Gift gift) {
        System.out.println("Gift: " + gift);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/byCreator/{username}")
    public ResponseEntity<List<Gift>> getGiftsByCreator(@PathVariable String username) {
        List<Gift> gifts = giftService.getGiftsByCreator(username);
        return ResponseEntity.ok(gifts);
    }
}
