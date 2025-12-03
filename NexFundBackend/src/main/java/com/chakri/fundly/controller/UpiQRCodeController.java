package com.chakri.fundly.controller;

import com.chakri.fundly.model.Events;
import com.chakri.fundly.model.Gift;
import com.chakri.fundly.model.Donation;
import com.chakri.fundly.service.EventService;
import com.chakri.fundly.service.GiftService;
import com.chakri.fundly.service.DonationService;
import com.chakri.fundly.service.UpiQRCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/upi")
public class UpiQRCodeController {

    @Autowired
    private UpiQRCodeService upiQRCodeService;

    @Autowired
    private EventService eventService;

    @Autowired
    private GiftService giftService;

    @Autowired
    private DonationService donationService;

    // Generate QR for Event
    @GetMapping("/event/{eventId}/qr")
    public ResponseEntity<Map<String, String>> generateEventQR(@PathVariable String eventId) {
        try {
            Optional<Events> eventOptional = eventService.getEventById(eventId);

            if (eventOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Event not found with ID: " + eventId));
            }

            Events event = eventOptional.get();

            // Generate UPI URL
            String upiUrl = upiQRCodeService.createEventUpiUrl(
                    event.getUpiId(),
                    event.getCreatedByUsername(),
                    event.getUpiMsg(),
                    event.getEventAmount()
            );

            // Generate QR Code as Base64
            String qrCodeBase64 = upiQRCodeService.createEventQRCodeBase64(
                    event.getUpiId(),
                    event.getCreatedByUsername(),
                    event.getUpiMsg(),
                    event.getEventAmount()
            );

            Map<String, String> response = new HashMap<>();
            response.put("eventId", eventId);
            response.put("eventTitle", event.getEventTitle());
            response.put("amount", String.valueOf(event.getEventAmount()));
            response.put("upiUrl", upiUrl);
            response.put("qrCodeBase64", qrCodeBase64);
            response.put("htmlImg", "<img src=\"data:image/png;base64," + qrCodeBase64 + "\" alt=\"Event QR Code\" />");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate Event QR code: " + e.getMessage()));
        }
    }

    // Generate QR for Gift
    @GetMapping("/gift/{giftId}/qr")
    public ResponseEntity<Map<String, String>> generateGiftQR(@PathVariable String giftId) {
        try {
            Optional<Gift> giftOptional = giftService.getGiftById(giftId);

            if (giftOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Gift not found with ID: " + giftId));
            }

            Gift gift = giftOptional.get();

            // Generate UPI URL (no amount - flexible)
            String upiUrl = upiQRCodeService.createGiftUpiUrl(
                    gift.getUpiId(),
                    gift.getCreatorUsername(),
                    gift.getUpiMsg()
            );

            // Generate QR Code as Base64
            String qrCodeBase64 = upiQRCodeService.createGiftQRCodeBase64(
                    gift.getUpiId(),
                    gift.getCreatorUsername(),
                    gift.getUpiMsg()
            );

            Map<String, String> response = new HashMap<>();
            response.put("giftId", giftId);
            response.put("giftTitle", gift.getTitle());
            response.put("upiUrl", upiUrl);
            response.put("qrCodeBase64", qrCodeBase64);
            response.put("htmlImg", "<img src=\"data:image/png;base64," + qrCodeBase64 + "\" alt=\"Gift QR Code\" />");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate Gift QR code: " + e.getMessage()));
        }
    }

    // Generate QR for Donation
    @GetMapping("/donation/{donationId}/qr")
    public ResponseEntity<Map<String, String>> generateDonationQR(@PathVariable String donationId) {
        try {
            Optional<Donation> donationOptional = donationService.getDonationById(donationId);

            if (donationOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Donation not found with ID: " + donationId));
            }

            Donation donation = donationOptional.get();

            // Generate UPI URL (no amount - flexible)
            String upiUrl = upiQRCodeService.createGiftUpiUrl(
                    donation.getUpiId(),
                    donation.getCreatorUsername(),
                    donation.getUpiMsg()
            );

            // Generate QR Code as Base64
            String qrCodeBase64 = upiQRCodeService.createGiftQRCodeBase64(
                    donation.getUpiId(),
                    donation.getCreatorUsername(),
                    donation.getUpiMsg()
            );

            Map<String, String> response = new HashMap<>();
            response.put("donationId", donationId);
            response.put("donationTitle", donation.getTitle());
            response.put("upiUrl", upiUrl);
            response.put("qrCodeBase64", qrCodeBase64);
            response.put("htmlImg", "<img src=\"data:image/png;base64," + qrCodeBase64 + "\" alt=\"Donation QR Code\" />");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate Donation QR code: " + e.getMessage()));
        }
    }

    // Generate QR for Event with custom amount
    @GetMapping("/event/{eventId}/qr/amount/{customAmount}")
    public ResponseEntity<Map<String, String>> generateEventCustomAmountQR(
            @PathVariable String eventId,
            @PathVariable int customAmount) {
        try {
            Optional<Events> eventOptional = eventService.getEventById(eventId);

            if (eventOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Event not found with ID: " + eventId));
            }

            Events event = eventOptional.get();

            // Generate UPI URL with custom amount
            String upiUrl = upiQRCodeService.createEventUpiUrl(
                    event.getUpiId(),
                    event.getCreatedByUsername(),
                    event.getUpiMsg(),
                    customAmount
            );

            // Generate QR Code as Base64
            String qrCodeBase64 = upiQRCodeService.createEventQRCodeBase64(
                    event.getUpiId(),
                    event.getCreatedByUsername(),
                    event.getUpiMsg(),
                    customAmount
            );

            Map<String, String> response = new HashMap<>();
            response.put("eventId", eventId);
            response.put("eventTitle", event.getEventTitle());
            response.put("customAmount", String.valueOf(customAmount));
            response.put("upiUrl", upiUrl);
            response.put("qrCodeBase64", qrCodeBase64);
            response.put("htmlImg", "<img src=\"data:image/png;base64," + qrCodeBase64 + "\" alt=\"Custom Amount Event QR Code\" />");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate custom amount Event QR code: " + e.getMessage()));
        }
    }
}
