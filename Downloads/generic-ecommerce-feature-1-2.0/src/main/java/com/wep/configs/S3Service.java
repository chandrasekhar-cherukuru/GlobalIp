package com.wep.configs;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import java.net.URL;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class S3Service {

    @Autowired
    private AmazonS3 s3Client;

    @Value("${aws.region}")
    private String region;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public boolean uploadFile(String key, MultipartFile file) {
        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());

            PutObjectRequest request = new PutObjectRequest(bucketName, key, file.getInputStream(), metadata);
            // Rely on bucket policy for public access; ACLs may be disabled (Bucket owner enforced)
            // Do not set canned ACL to avoid AccessControlListNotSupported errors
            s3Client.putObject(request);
            System.out.println("S3 upload successful: bucket=" + bucketName + ", key=" + key);
            return true;
        } catch (Exception e) {
            System.err.println("S3 upload failed: bucket=" + bucketName + ", key=" + key);
            e.printStackTrace();
            return false;
        }
    }

    public void deleteFile(String bucketName, String objectKey) {
        try {
            // Delete the object from the specified S3 bucket
            s3Client.deleteObject(bucketName, objectKey);

        } catch (Exception e) {
            // Handle the exception (e.g., log it)
        }
    }

    public void makeFilePublic(String bucketName, String objectKey) {
        try {
            // Set the ACL to public read for an existing object
            s3Client.setObjectAcl(bucketName, objectKey, CannedAccessControlList.PublicRead);
            System.out.println("Successfully made file public: " + objectKey);
        } catch (Exception e) {
            System.err.println("Failed to make file public: " + objectKey + " - " + e.getMessage());
            e.printStackTrace();
            // Re-throw the exception so the controller can handle it
            throw new RuntimeException("Failed to make file public: " + e.getMessage(), e);
        }
    }

    public boolean isFilePublic(String bucketName, String objectKey) {
        try {
            // Check if the object exists and is accessible
            return s3Client.doesObjectExist(bucketName, objectKey);
        } catch (Exception e) {
            System.err.println("Error checking file existence: " + objectKey + " - " + e.getMessage());
            return false;
        }
    }

    public String generatePresignedUrl(String bucketName, String objectKey) {
        try {
            // Generate a pre-signed URL that expires in 1 hour
            Date expiration = new Date();
            long expTimeMillis = expiration.getTime();
            expTimeMillis += 1000 * 60 * 60; // 1 hour
            expiration.setTime(expTimeMillis);

            GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucketName, objectKey)
                    .withMethod(com.amazonaws.HttpMethod.GET)
                    .withExpiration(expiration);

            URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
            return url.toString();
        } catch (Exception e) {
            System.err.println("Error generating presigned URL: " + objectKey + " - " + e.getMessage());
            return null;
        }
    }

}
