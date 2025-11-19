package com.wep.users;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;


public class Address {
	
	private String addrId;
	private String name;
	private String mobile;
	private String houseName;
	private String street;
	private String landMark;
	private String city;
	private String state;
	private String pinCode;
	private String country;
	private String addrType;
	private String countryCode;
		
	
	public Address() {
	    // Default constructor
	}

	
	public Address(String name,String mobile, String addrType, String houseName, String street, String landMark, String city,
			String state, String pinCode, String country, String countryCode) {
		super();
		this.name = name;
		this.mobile = mobile;
		this.addrType = addrType;
		this.houseName = houseName;
		this.street = street;
		this.landMark = landMark;
		this.city = city;
		this.state = state;
		this.pinCode = pinCode;
		this.country = country;
		this.countryCode=countryCode;
	}
	
	public Address(String input) {
	  
	        String[] parts = input.split("@");

	        if (parts.length != 12) {
	            throw new IllegalArgumentException("Invalid input format");
	        }
	        addrId = parts[0];
	        name = parts[1];
	        mobile = parts[2];
	        houseName = parts[3];
	        street = parts[4];
	        landMark = parts[5];
	        city = parts[6];
	        state = parts[7];
	        pinCode = parts[8];
	        country = parts[9];
	        addrType = parts[10];
	        countryCode=parts[11];
	    }


	
	@ManyToOne
	@JoinColumn(name = "PAR_CODE", insertable=false, updatable=false) // Name of the foreign key column
	@JsonBackReference
	private Users users;

	public Users getUsers() {
		return users;
	}
	public void setUsers(Users users) {
		this.users = users;
	}
	
	public String getAddrId() {
		return addrId;
	}
	public void setAddrId(String addrId) {
		this.addrId = addrId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getHouseName() {
		return houseName;
	}
	public void setHouseName(String houseName) {
		this.houseName = houseName;
	}
	public String getStreet() {
		return street;
	}
	public void setStreet(String street) {
		this.street = street;
	}
	public String getLandMark() {
		return landMark;
	}
	public void setLandMark(String landMark) {
		this.landMark = landMark;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getPinCode() {
		return pinCode;
	}
	public void setPinCode(String pinCode) {
		this.pinCode = pinCode;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getAddrType() {
		return addrType;
	}
	public void setAddrType(String addrType) {
		this.addrType = addrType;
	}
	public String getCountryCode() {
		return countryCode;
	}
	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}


	@Override
	public String toString() {
		return  addrId+"@"+name+"@"+mobile+"@"+houseName+"@"+street+"@"+landMark+"@"+city+"@"+state+"@"+pinCode+"@"+country+"@"+addrType+"@"+countryCode;
	}
	
}