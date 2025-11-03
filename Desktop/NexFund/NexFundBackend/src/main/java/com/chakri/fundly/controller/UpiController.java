package com.chakri.fundly.controller;

import com.chakri.fundly.model.Events;
import com.chakri.fundly.model.Gift;
import com.chakri.fundly.service.EventService;
import com.chakri.fundly.service.GiftService;
import com.chakri.fundly.service.UpiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/upi")
public class UpiController {

    @Autowired
    private UpiService upiService;

    @Autowired
    private EventService eventService;

    @Autowired
    private GiftService giftService;

    @GetMapping("/")
    public String greet() {
        return "Inside UPI Controller";
    }

    // ===== EVENT ENDPOINTS (Fixed Amount) =====

    // Generate UPI link for a specific event (default amount)
    @GetMapping("/event/generate/{eventId}")
    public ResponseEntity<String> generateUpiLinkForEvent(@PathVariable String eventId) {

        Optional<Events> eventOptional = eventService.getEventById(eventId);

        if (eventOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Event not found with ID: " + eventId);
        }

        Events event = eventOptional.get();

        String upiLink = upiService.createUpiLink(
                event.getUpiId(),
                event.getCreatedByUsername(),
                event.getUpiMsg(),
                String.valueOf(event.getEventAmount()) // Fixed amount from event
        );

        return ResponseEntity.ok(upiLink);
    }

    // Generate UPI link for event with custom amount
    @GetMapping("/event/generate/{eventId}/amount/{customAmount}")
    public ResponseEntity<String> generateCustomAmountUpiLink(
            @PathVariable String eventId,
            @PathVariable int customAmount) {

        Optional<Events> eventOptional = eventService.getEventById(eventId);

        if (eventOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Event not found with ID: " + eventId);
        }

        Events event = eventOptional.get();

        String upiLink = upiService.createUpiLink(
                event.getUpiId(),
                event.getCreatedByUsername(),
                event.getUpiMsg(),
                String.valueOf(customAmount)
        );

        return ResponseEntity.ok(upiLink);
    }

    // Get event payment details
    @GetMapping("/event/details/{eventId}")
    public ResponseEntity<Events> getEventPaymentDetails(@PathVariable String eventId) {

        Optional<Events> eventOptional = eventService.getEventById(eventId);

        if (eventOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(eventOptional.get());
    }

    // ===== GIFT ENDPOINTS (Flexible Amount) =====

    // Generate UPI link for gift (no amount - user decides)
    @GetMapping("/gift/generate/{giftId}")
    public ResponseEntity<String> generateUpiLinkForGift(@PathVariable String giftId) {

        Optional<Gift> giftOptional = giftService.getGiftById(giftId);

        if (giftOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Gift not found with ID: " + giftId);
        }

        Gift gift = giftOptional.get();

        // Use 3-parameter method (no amount)
        String upiLink = upiService.createUpiLink(
                gift.getUpiId(),
                gift.getCreatorUsername(),
                gift.getUpiMsg() // NO AMOUNT - user chooses in UPI app
        );

        return ResponseEntity.ok(upiLink);
    }

    // Get gift payment details
    @GetMapping("/gift/details/{giftId}")
    public ResponseEntity<Gift> getGiftPaymentDetails(@PathVariable String giftId) {

        Optional<Gift> giftOptional = giftService.getGiftById(giftId);

        if (giftOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(giftOptional.get());
    }

    // ===== LEGACY ENDPOINTS (Backward Compatibility) =====

    // Legacy event endpoint (maps to new event endpoint)
    @GetMapping("/generate/{eventId}")
    public ResponseEntity<String> generateUpiLinkForEventLegacy(@PathVariable String eventId) {
        return generateUpiLinkForEvent(eventId);
    }

    // Legacy event custom amount endpoint
    @GetMapping("/generate/{eventId}/amount/{customAmount}")
    public ResponseEntity<String> generateCustomAmountUpiLinkLegacy(
            @PathVariable String eventId,
            @PathVariable int customAmount) {
        return generateCustomAmountUpiLink(eventId, customAmount);
    }

    // Legacy event details endpoint
    @GetMapping("/details/{eventId}")
    public ResponseEntity<Events> getEventPaymentDetailsLegacy(@PathVariable String eventId) {
        return getEventPaymentDetails(eventId);
    }
}
