package com.wep.homepage.service;

import com.wep.configs.S3Service;
import com.wep.homepage.model.CarouselImage;
import com.wep.homepage.repository.CarouselRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class CarouselService {

    @Autowired
    private CarouselRepository carouselRepository;

    @Autowired
    private S3Service s3Service;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public List<CarouselImage> getAllCarouselImages() {
        return carouselRepository.findAll();
    }

    public CarouselImage uploadCarouselImage(MultipartFile file) throws IOException {
        String key = "carousel/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        boolean uploaded = s3Service.uploadFile(key, file);
        if (!uploaded) {
            throw new IOException("Failed to upload file to S3");
        }
        CarouselImage carouselImage = new CarouselImage();
        String publicUrl = "https://" + bucketName + ".s3." + System.getProperty("aws.region", "") + ".amazonaws.com/" + key;
        carouselImage.setImageUrl(publicUrl);
        return carouselRepository.save(carouselImage);
    }

    public void deleteCarouselImage(Long id) {
        CarouselImage image = carouselRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carousel image not found"));
        try {
            // Expecting imageUrl format: https://{bucket}.s3.{region}.amazonaws.com/{key}
            String key = image.getImageUrl().substring(image.getImageUrl().indexOf(".amazonaws.com/") + ".amazonaws.com/".length());
            s3Service.deleteFile(bucketName, key);
        } catch (Exception ignored) {
        }
        carouselRepository.delete(image);
    }

    public CarouselImage updateImage(Long id, MultipartFile file) throws IOException {
        CarouselImage existingImage = carouselRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carousel image not found"));

        // Delete old file
        try {
            String oldKey = existingImage.getImageUrl().substring(existingImage.getImageUrl().indexOf(".amazonaws.com/") + ".amazonaws.com/".length());
            s3Service.deleteFile(bucketName, oldKey);
        } catch (Exception ignored) {
        }

        // Upload new file
        String newKey = "carousel/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        boolean uploaded = s3Service.uploadFile(newKey, file);
        if (!uploaded) {
            throw new IOException("Failed to upload file to S3");
        }
        String publicUrl = "https://" + bucketName + ".s3." + System.getProperty("aws.region", "") + ".amazonaws.com/" + newKey;
        existingImage.setImageUrl(publicUrl);
        return carouselRepository.save(existingImage);
    }
}



