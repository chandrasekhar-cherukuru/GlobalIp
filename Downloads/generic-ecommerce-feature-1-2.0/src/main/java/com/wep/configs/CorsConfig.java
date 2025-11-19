package com.wep.configs;

import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Added http://localhost:3001 for admin frontend
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",  // Client frontend local
                "http://localhost:3001",  // Admin frontend local
                "https://divinedepot.netlify.app",  // Client deployed
                "https://admin-divine.netlify.app",  // Admin deployed
                "http://www.divinedepot.in.s3-website.ap-south-1.amazonaws.com",  // S3 client
                "http://www.admin.divinedepot.in.s3-website.ap-south-1.amazonaws.com",  // S3 admin
                "https://www.divinedepot.in/",  // Domain client
                "https://admin.divinedepot.in/",  // Domain admin
                "http://devinedepot.s3-website.eu-north-1.amazonaws.com"  // S3 bucket site
        ));

        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
