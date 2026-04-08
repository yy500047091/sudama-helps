package com.sudama.helps;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Main application class for Sudama Helps
 * 
 * Demonstrates:
 * - Spring Boot application setup
 * - Enabling key features (caching, async, auditing)
 * - Production-ready configuration
 */
@SpringBootApplication
@EnableCaching
@EnableAsync
@EnableJpaAuditing
@EnableTransactionManagement
public class
SudamaHelpsApplication {

    public static void main(String[] args) {
        SpringApplication.run(SudamaHelpsApplication.class, args);
    }
}
