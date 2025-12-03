package com.wep.homepage.repository;

import com.wep.homepage.model.CarouselImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarouselRepository extends JpaRepository<CarouselImage, Long> {
}



