package com.sudama.helps.config;

import com.sudama.helps.entity.User;
import com.sudama.helps.enums.UserRole;
import com.sudama.helps.enums.UserStatus;
import com.sudama.helps.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Component to initialize default data in the database on application startup.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
    }

    private void seedAdminUser() {
        String adminEmail = "admin@sudama.com";
        
        if (!userRepository.existsByEmailAndIsDeletedFalse(adminEmail)) {
            log.info("Creating default admin user: {}", adminEmail);
            
            User admin = User.builder()
                    .email(adminEmail)
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .fullName("System Administrator")
                    .phoneNumber("0000000000")
                    .role(UserRole.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .emailVerified(true)
                    .phoneVerified(true)
                    .build();
            
            userRepository.save(admin);
            log.info("Default admin user created successfully.");
        } else {
            log.info("Admin user already exists. Skipping seeding.");
        }
    }
}
