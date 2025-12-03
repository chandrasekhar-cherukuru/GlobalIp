package com.wep.users;

import java.time.LocalDateTime;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "GECOMUSERS")
public class Users {
	
	public Users() {
		// TODO Auto-generated constructor stub
	} 
	public Users(String newOtpToken) {
		this.otpToken = newOtpToken;
	}
	
	@Id
    @GenericGenerator(name = "client_id", strategy = "com.wep.configs.CustomUserIdGenerator")
    @GeneratedValue(generator = "client_id")  
	@Column(name = "PAR_CODE", length = 50)
    private String userId;

	
	@Column(name = "COMPCODE")
    private Long compCode=1L;

    @Column(name = "PAR_NAME")
    private String parName;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "MOBILE1")
    private String mobile1;

    @Column(name = "MOBILE2")
    private String mobile2;

    @Column(name = "PAN")
    private String pan;

    @Column(name = "ACTYPE")
    private String acType;

    @Column(name = "PHOTO")
    private String photo;

    @Column(name = "CREATEDBY")
    private String createdBy;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CREATEDTIME")
    private LocalDateTime createdTime;

    @Column(name = "MODIFIEDBY")
    private String modifiedBy;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "MODIFIEDTIME")
    private LocalDateTime modifiedTime;

    @Column(name = "ACTIVE")
    private int active;
    
    @Column(name ="OTP_TOKEN")
    private String otpToken;
    
    @Column(name ="FORGOT_PASSWORD_TOKEN")
    private String forgotPasswordToken;
    
    @Column(name ="COUNTRY_CODE")
    private String countryCode;
    
    @Column(name ="PAR_ADD1")
    private String address1;
    
    @Column(name ="PAR_ADD2")
    private String address2;
    
    @Column(name ="PAR_ADD3")
    private String address3;
    
    @Column(name ="password")
    private String password;
    
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public Long getCompCode() {
		return compCode;
	}
	public void setCompCode(Long compCode) {
		this.compCode = compCode;
	}
	public String getParName() {
		return parName;
	}
	public void setParName(String parName) {
		this.parName = parName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getMobile1() {
		return mobile1;
	}
	public void setMobile1(String mobile1) {
		this.mobile1 = mobile1;
	}
	public String getMobile2() {
		return mobile2;
	}
	public void setMobile2(String mobile2) {
		this.mobile2 = mobile2;
	}
	public String getPan() {
		return pan;
	}
	public void setPan(String pan) {
		this.pan = pan;
	}
	public String getAcType() {
		return acType;
	}
	public void setAcType(String acType) {
		this.acType = acType;
	}
	public String getPhoto() {
		return photo;
	}
	public void setPhoto(String photo) {
		this.photo = photo;
	}
	public String getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	public LocalDateTime getCreatedTime() {
		return createdTime;
	}
	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}
	public String getModifiedBy() {
		return modifiedBy;
	}
	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}
	public LocalDateTime getModifiedTime() {
		return modifiedTime;
	}
	public void setModifiedTime(LocalDateTime modifiedTime) {
		this.modifiedTime = modifiedTime;
	}
	public int getActive() {
		return active;
	}
	public String getForgotPasswordToken() {
		return forgotPasswordToken;
	}
	public void setForgotPasswordToken(String forgotPasswordToken) {
		this.forgotPasswordToken = forgotPasswordToken;
	}
	public void setActive(int active) {
		this.active = active;
	}
	public String getOtpToken() {
		return otpToken;
	}
	public void setOtpToken(String otpToken) {
		this.otpToken = otpToken;
	}
	public String getCountryCode() {
		return countryCode;
	}
	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}
	public String getAddress1() {
		return address1;
	}
	public void setAddress1(String address1) {
		this.address1 = address1;
	}
	public String getAddress2() {
		return address2;
	}
	public void setAddress2(String address2) {
		this.address2 = address2;
	}
	public String getAddress3() {
		return address3;
	}
	public void setAddress3(String address3) {
		this.address3 = address3;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
}
