package com.wep.configs;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.amazonaws.services.s3.AmazonS3;

@Configuration
public class AppConfig{
	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}
}
