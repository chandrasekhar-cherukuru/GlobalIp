package com.wep.returnRequest;


import jakarta.validation.constraints.NotBlank;

public class ReturnRequestDTO {

    @NotBlank
    private String reason;
    
    private String comment;
    
    @NotBlank
    private String accountNumber;
    
    @NotBlank
    private String ifscCode;
    
    @NotBlank
    private String bankName;
    
    @NotBlank
    private String accountHolderName;

    private boolean refundInitiated=true;

    // Constructors
    public ReturnRequestDTO() {
    }

    public ReturnRequestDTO(@NotBlank String reason, String comment, @NotBlank String accountNumber, @NotBlank String ifscCode,
                            @NotBlank String bankName, @NotBlank String accountHolderName) {
        this.reason = reason;
        this.comment = comment;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
        this.bankName = bankName;
        this.accountHolderName = accountHolderName;
    }

    // Getters and Setters
    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public void setAccountHolderName(String accountHolderName) {
        this.accountHolderName = accountHolderName;
    }

	public boolean isRefundInitiated() {
		return refundInitiated;
	}

	public void setRefundInitiated(boolean refundInitiated) {
		this.refundInitiated = refundInitiated;
	}
    
    
}

