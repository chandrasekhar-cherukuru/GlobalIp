package com.wep.coupon;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class CouponApplicationService {
    @Autowired
    private CouponRepository couponRepository;

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Optional<Coupon> getCouponById(Long id) {
        return couponRepository.findById(id);
    }

    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    public Coupon updateCoupon(Long id, Coupon couponDetails) {
        Coupon coupon = couponRepository.findById(id).orElseThrow(() -> new RuntimeException("Coupon not found"));
        coupon.setCouponName(couponDetails.getCouponName());
        coupon.setCouponType(couponDetails.getCouponType());
        coupon.setCouponValue(couponDetails.getCouponValue());
        coupon.setCouponStatus(couponDetails.getCouponStatus());
        return couponRepository.save(coupon);
    }

    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id).orElseThrow(() -> new RuntimeException("Coupon not found"));
        couponRepository.delete(coupon);
    }

    public Optional<Coupon> getCouponByName(String couponName) {
        return couponRepository.findByCouponName(couponName);
    }

}
