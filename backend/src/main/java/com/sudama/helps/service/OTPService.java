package com.sudama.helps.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import java.security.SecureRandom;

/**
 * Service to handle OTP generation and verification.
 */
@org.springframework.stereotype.Service
public class OTPService {

    private static final Logger log = LoggerFactory.getLogger(OTPService.class);

    private final RedisTemplate<String, String> redisTemplate;
    private final SecureRandom random = new SecureRandom();

    public OTPService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String generateOTP() {
        int otp = 100000 + random.nextInt(900000);
        log.info("#### OTP: Generated new OTP: {}", otp);
        return String.valueOf(otp);
    }
}
