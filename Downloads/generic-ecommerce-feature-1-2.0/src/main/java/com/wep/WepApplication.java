package com.wep;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class})
public class WepApplication {
	public static void main(String[] args) {
		SpringApplication.run(WepApplication.class, args);
		System.out.println("Hello");  
	}

}
