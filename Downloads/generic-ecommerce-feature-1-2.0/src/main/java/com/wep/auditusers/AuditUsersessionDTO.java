package com.wep.auditusers;

public class AuditUsersessionDTO {

	private String userId;
	private String mobile1;
	private String otpToken;
	private String countryCode;
	private String errorMessage;
	
	public AuditUsersessionDTO() {}
	
	public AuditUsersessionDTO(String userId, String otpToken) {
		this.userId=userId;
		this.otpToken=otpToken;
	}
	 
	public AuditUsersessionDTO(String userId, String otpToken, String mobile1) {
		this.userId=userId;
		this.otpToken=otpToken;
		this.mobile1=mobile1;
	}
	
	public AuditUsersessionDTO(String userId, String otpToken, String countryCode ,String mobile1) {
		this.userId=userId;
		this.otpToken=otpToken;
		this.mobile1=mobile1;
		this.countryCode=countryCode;
	}
	public AuditUsersessionDTO(String errorMessage) {
		this.errorMessage=errorMessage;
		// TODO Auto-generated constructor stub
	}

	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getMobile1() {
		return mobile1;
	}
	public void setMobile1(String mobile1) {
		this.mobile1 = mobile1;
	}
	public String getOtpToken() {
		return otpToken;
	}
	public void setOtpToken(String otpToken) {
		this.otpToken = otpToken;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}
	
	
}
