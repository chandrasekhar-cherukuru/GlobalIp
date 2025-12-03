package com.chakri.fundly.service;

import org.springframework.stereotype.Service;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class UpiService {

    // Method with amount (for Events - fixed amount)
    public String createUpiLink(String upiId, String name, String message, String amount) {

        // Step 1: Start with the base UPI format
        String upiLink = "upi://pay?";

        // Step 2: Add the UPI ID (like 7981398515@ybl)
        upiLink += "pa=" + encodeText(upiId);

        // Step 3: Add person's name if provided
        if (name != null && !name.isEmpty()) {
            upiLink += "&pn=" + encodeText(name);
        }

        // Step 4: Add message if provided
        if (message != null && !message.isEmpty()) {
            upiLink += "&tn=" + encodeText(message);
        }

        // Step 5: Add amount if provided
        if (amount != null && !amount.isEmpty()) {
            upiLink += "&am=" + encodeText(amount);
        }

        // Step 6: Add currency (always INR for India)
        upiLink += "&cu=INR";

        return upiLink;
    }

    // Overloaded method without amount (for Gifts/Donations - flexible amount)
    public String createUpiLink(String upiId, String name, String message) {

        // Step 1: Start with the base UPI format
        String upiLink = "upi://pay?";

        // Step 2: Add the UPI ID (like 7981398515@ybl)
        upiLink += "pa=" + encodeText(upiId);

        // Step 3: Add person's name if provided
        if (name != null && !name.isEmpty()) {
            upiLink += "&pn=" + encodeText(name);
        }

        // Step 4: Add message if provided
        if (message != null && !message.isEmpty()) {
            upiLink += "&tn=" + encodeText(message);
        }

        // Step 5: NO AMOUNT - user decides in UPI app
        // Skip the "&am=" parameter entirely

        // Step 6: Add currency (always INR for India)
        upiLink += "&cu=INR";

        return upiLink;
    }

    // This method converts special characters to URL-safe format
    // For example: "John Doe" becomes "John%20Doe"
    private String encodeText(String text) {
        try {
            return URLEncoder.encode(text, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return text; // Return original if encoding fails
        }
    }

    // This method extracts UPI ID from your input text
    public String extractUpiId(String inputText) {
        // Input: "7981398515@ybl + message"
        // We want: "7981398515@ybl"

        String[] parts = inputText.split("\\s+"); // Split by spaces

        for (String part : parts) {
            // Look for text containing @ symbol (UPI ID pattern)
            if (part.contains("@")) {
                return part;
            }
        }

        return inputText.trim(); // Return original if no @ found
    }
}
