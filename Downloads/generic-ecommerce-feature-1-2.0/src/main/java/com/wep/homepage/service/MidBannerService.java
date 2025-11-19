package com.wep.homepage.service;

import com.wep.configs.S3Service;
import com.wep.homepage.model.MidBannerImage;
import com.wep.homepage.repository.MidBannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class MidBannerService {

    @Autowired
    private MidBannerRepository midBannerRepository;

    @Autowired
    private S3Service s3Service;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public List<MidBannerImage> getAll() {
        return midBannerRepository.findAll();
    }

    public MidBannerImage upload(MultipartFile file) throws IOException {
        String key = "mid-banners/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        boolean uploaded = s3Service.uploadFile(key, file);
        if (!uploaded) {
            throw new IOException("Failed to upload file to S3");
        }
        MidBannerImage image = new MidBannerImage();
        String url = "https://" + bucketName + ".s3." + System.getProperty("aws.region", "") + ".amazonaws.com/" + key;
        image.setImageUrl(url);
        return midBannerRepository.save(image);
    }

    public void delete(Long id) {
        MidBannerImage image = midBannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mid banner not found"));
        try {
            String key = image.getImageUrl().substring(image.getImageUrl().indexOf(".amazonaws.com/") + ".amazonaws.com/".length());
            s3Service.deleteFile(bucketName, key);
        } catch (Exception ignored) {}
        midBannerRepository.delete(image);
    }

    public MidBannerImage update(Long id, MultipartFile file) throws IOException {
        MidBannerImage image = midBannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mid banner not found"));
        try {
            String oldKey = image.getImageUrl().substring(image.getImageUrl().indexOf(".amazonaws.com/") + ".amazonaws.com/".length());
            s3Service.deleteFile(bucketName, oldKey);
        } catch (Exception ignored) {}

        String newKey = "mid-banners/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        boolean uploaded = s3Service.uploadFile(newKey, file);
        if (!uploaded) {
            throw new IOException("Failed to upload file to S3");
        }
        String url = "https://" + bucketName + ".s3." + System.getProperty("aws.region", "") + ".amazonaws.com/" + newKey;
        image.setImageUrl(url);
        return midBannerRepository.save(image);
    }
}


