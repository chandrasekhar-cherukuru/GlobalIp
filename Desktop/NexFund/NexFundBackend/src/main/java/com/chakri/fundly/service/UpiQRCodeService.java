package com.chakri.fundly.service;

import com.google.zxing.*;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class UpiQRCodeService {

    private static final Logger logger = LoggerFactory.getLogger(UpiQRCodeService.class);
    private final Map<EncodeHintType, Object> hintMap = new HashMap<>();
    private final int size = 350;

    @Autowired
    private UpiService upiService;

    public UpiQRCodeService() {
        hintMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
        hintMap.put(EncodeHintType.CHARACTER_SET, StandardCharsets.UTF_8);
        hintMap.put(EncodeHintType.MARGIN, 1);
    }

    // Generate QR for Event (with fixed amount)
    public String createEventQRCodeBase64(String upiId, String payeeName, String message, int amount) throws WriterException, IOException {
        String upiUrl = upiService.createUpiLink(upiId, payeeName, message, String.valueOf(amount));
        logger.info("Generated Event UPI URL for QR: {}", upiUrl);
        return createQRCodeBase64(upiUrl);
    }

    // Generate QR for Gift/Donation (without amount - flexible)
    public String createGiftQRCodeBase64(String upiId, String payeeName, String message) throws WriterException, IOException {
        String upiUrl = upiService.createUpiLink(upiId, payeeName, message);
        logger.info("Generated Gift/Donation UPI URL for QR: {}", upiUrl);
        return createQRCodeBase64(upiUrl);
    }

    // Core QR generation method
    public String createQRCodeBase64(String qrCodeData) throws WriterException, IOException {
        BitMatrix matrix = new MultiFormatWriter()
                .encode(qrCodeData, BarcodeFormat.QR_CODE, size, size, hintMap);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "png", baos);

        return Base64.getEncoder().encodeToString(baos.toByteArray());
    }

    // Generate UPI URL for Event
    public String createEventUpiUrl(String upiId, String payeeName, String message, int amount) {
        return upiService.createUpiLink(upiId, payeeName, message, String.valueOf(amount));
    }

    // Generate UPI URL for Gift/Donation
    public String createGiftUpiUrl(String upiId, String payeeName, String message) {
        return upiService.createUpiLink(upiId, payeeName, message);
    }
}
