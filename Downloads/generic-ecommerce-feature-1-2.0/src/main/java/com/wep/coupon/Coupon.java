package com.wep.coupon;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="coupon")
public class Coupon {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="coupon_id")
    private Long couponId;
    
    @Column(name="coupon_name")
    private String couponName;
    
    @Column(name="coupon_type")
    private String couponType;
   
    @Column(name="coupon_value")
    private String couponValue;

    @Column(name="coupon_status")
    private String couponStatus;

	public Long getCouponId() {
		return couponId;
	}

	public void setCouponId(Long couponId) {
		this.couponId = couponId;
	}

	public String getCouponName() {
		return couponName;
	}

	public void setCouponName(String couponName) {
		this.couponName = couponName;
	}

	public String getCouponType() {
		return couponType;
	}

	public void setCouponType(String couponType) {
		this.couponType = couponType;
	}

	public String getCouponValue() {
		return couponValue;
	}

	public void setCouponValue(String couponValue) {
		this.couponValue = couponValue;
	}

	public String getCouponStatus() {
		return couponStatus;
	}

	public void setCouponStatus(String couponStatus) {
		this.couponStatus = couponStatus;
	}
    
	
    
}
