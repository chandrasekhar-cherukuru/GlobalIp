package com.chakri.fundly;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FundlyApplication {

    public static void main(String[] args) {
        // Print Java version before starting the Spring Boot app
        System.out.println("=====================================");
        System.out.println(" Running with Java version: " + System.getProperty("java.version"));
        System.out.println(" Java Vendor: " + System.getProperty("java.vendor"));
        System.out.println(" Java Home: " + System.getProperty("java.home"));
        System.out.println("=====================================");

        SpringApplication.run(FundlyApplication.class, args);
    }

}
