package com.wep.orders;

public enum PaymentStatus {
	PAID("PAID"),
    PENDING("PENDING"),
    fAILED("FAILED");

    private final String status;

    PaymentStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public static PaymentStatus fromString(String status) {
        for (PaymentStatus PaymentStatus : PaymentStatus.values()) {
            if (PaymentStatus.status.equalsIgnoreCase(status)) {
                return PaymentStatus;
            }
        }
        throw new IllegalArgumentException("Unknown status: " + status);
    }

}
