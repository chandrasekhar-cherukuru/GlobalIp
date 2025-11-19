package com.wep.homepage.repository;

import com.wep.homepage.model.MidBannerImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MidBannerRepository extends JpaRepository<MidBannerImage, Long> {
}


