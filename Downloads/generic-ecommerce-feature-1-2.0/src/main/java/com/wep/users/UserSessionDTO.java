package com.wep.users;

public class UserSessionDTO {

	private String userId;
	private String mobile1;
	private String otpToken;
	private String countryCode;
	private String errorMessage;
	private String name;
	private String emailId;
	private String password;
	
	public UserSessionDTO() {}
	
	public UserSessionDTO(String userId, String otpToken) {
		this.userId=userId;
		this.otpToken=otpToken;
	}
	 
	public UserSessionDTO(String userId, String otpToken, String mobile1) {
		this.userId=userId;
		this.otpToken=otpToken;
		this.mobile1=mobile1;
	}
	
	public UserSessionDTO(String userId, String otpToken, String countryCode ,String mobile1, String name, String emailId) {
		this.userId=userId;
		this.otpToken=otpToken;
		this.mobile1=mobile1;
		this.countryCode=countryCode;
		this.name=name;
		this.emailId=emailId;
	}
	
	public UserSessionDTO(String userId, String emailId,String password, String erroMessage) {
		this.userId=userId;
		this.emailId=emailId;
		this.password=password;
		this.errorMessage=erroMessage;
	}
	
	public UserSessionDTO(String errorMessage) {
		this.errorMessage=errorMessage;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	
}
