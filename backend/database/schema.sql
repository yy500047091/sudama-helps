-- SUDAMA HELPS Database Schema
-- MySQL 8.0+
-- Optimized for high performance and scalability

-- Create database
CREATE DATABASE IF NOT EXISTS sudama_helps
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE sudama_helps;

-- Users table (Customers and Service Providers)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    profile_image_url VARCHAR(500),
    
    -- Address fields
    street_address VARCHAR(200),
    area VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    landmark VARCHAR(200),
    
    -- Authentication
    last_login_at TIMESTAMP NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    fcm_token VARCHAR(255),
    
    -- Service Provider specific
    rating DECIMAL(3, 2),
    total_reviews INT DEFAULT 0,
    total_completed_bookings INT DEFAULT 0,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_phone (phone_number),
    INDEX idx_role_status (role, status),
    INDEX idx_created_at (created_at),
    INDEX idx_rating (rating),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services table
CREATE TABLE services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    duration_minutes INT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    icon_url VARCHAR(500),
    image_url VARCHAR(500),
    total_bookings BIGINT DEFAULT 0,
    average_rating DECIMAL(3, 2),
    is_popular BOOLEAN DEFAULT FALSE,
    display_order INT,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Indexes
    INDEX idx_category_status (category, status),
    INDEX idx_name (name),
    INDEX idx_popular (is_popular, total_bookings),
    INDEX idx_rating (average_rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bookings table
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_number VARCHAR(20) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    provider_id BIGINT,
    service_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    
    -- Scheduling
    scheduled_time TIMESTAMP NOT NULL,
    actual_start_time TIMESTAMP NULL,
    actual_end_time TIMESTAMP NULL,
    
    -- Address
    booking_street_address VARCHAR(200),
    booking_area VARCHAR(100),
    booking_city VARCHAR(50),
    booking_pincode VARCHAR(10),
    booking_latitude DECIMAL(10, 8),
    booking_longitude DECIMAL(11, 8),
    booking_landmark VARCHAR(200),
    
    special_instructions TEXT,
    
    -- Pricing
    service_price DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Payment
    payment_method VARCHAR(20),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payment_transaction_id VARCHAR(100),
    
    -- Cancellation
    cancellation_reason TEXT,
    cancelled_by_user_id BIGINT,
    cancelled_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    
    -- OTP verification
    otp VARCHAR(6),
    otp_verified BOOLEAN DEFAULT FALSE,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Foreign keys
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    
    -- Indexes for performance
    INDEX idx_customer_id (customer_id),
    INDEX idx_provider_id (provider_id),
    INDEX idx_service_id (service_id),
    INDEX idx_status (status),
    INDEX idx_scheduled_time (scheduled_time),
    INDEX idx_booking_number (booking_number),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at),
    INDEX idx_provider_status_time (provider_id, status, scheduled_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews table
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    provider_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    helpful_count INT DEFAULT 0,
    provider_response TEXT,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Foreign keys
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES users(id),
    
    -- Indexes
    INDEX idx_booking_id (booking_id),
    INDEX idx_provider_id (provider_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications table
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id BIGINT,
    reference_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    
    INDEX idx_user_id_read (user_id, is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refresh Tokens table for JWT
CREATE TABLE refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit Log table
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at),
    INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample services
INSERT INTO services (name, description, category, base_price, duration_minutes, status, is_popular, display_order)
VALUES
('House Cleaning', 'Complete house cleaning service', 'CLEANING', 500.00, 120, 'ACTIVE', TRUE, 1),
('Plumbing Repair', 'Expert plumbing services', 'PLUMBING', 300.00, 60, 'ACTIVE', TRUE, 2),
('Electrical Work', 'Electrical repair and installation', 'ELECTRICAL', 400.00, 90, 'ACTIVE', TRUE, 3),
('AC Repair', 'Air conditioner servicing and repair', 'AC_REPAIR', 600.00, 90, 'ACTIVE', TRUE, 4),
('Painting', 'Professional painting services', 'PAINTING', 800.00, 240, 'ACTIVE', FALSE, 5),
('Pest Control', 'Comprehensive pest control', 'PEST_CONTROL', 1000.00, 120, 'ACTIVE', TRUE, 6),
('Appliance Repair', 'Home appliance repair', 'APPLIANCE_REPAIR', 350.00, 60, 'ACTIVE', FALSE, 7),
('Gardening', 'Garden maintenance services', 'GARDENING', 450.00, 120, 'ACTIVE', FALSE, 8);

-- Create admin user (password: Admin@123 - BCrypt hashed)
INSERT INTO users (full_name, email, phone_number, password_hash, role, status, email_verified, phone_verified)
VALUES ('System Admin', 'admin@sudamahelps.com', '9999999999', 
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCy', 
        'ADMIN', 'ACTIVE', TRUE, TRUE);

-- Performance optimization views
CREATE OR REPLACE VIEW active_bookings_view AS
SELECT 
    b.id,
    b.booking_number,
    b.status,
    b.scheduled_time,
    c.full_name as customer_name,
    c.phone_number as customer_phone,
    p.full_name as provider_name,
    p.phone_number as provider_phone,
    s.name as service_name,
    b.total_amount
FROM bookings b
JOIN users c ON b.customer_id = c.id
LEFT JOIN users p ON b.provider_id = p.id
JOIN services s ON b.service_id = s.id
WHERE b.status IN ('PENDING', 'ASSIGNED', 'CONFIRMED', 'IN_PROGRESS')
AND b.is_deleted = FALSE;

-- Provider performance view
CREATE OR REPLACE VIEW provider_performance_view AS
SELECT 
    u.id,
    u.full_name,
    u.email,
    u.phone_number,
    u.rating,
    u.total_reviews,
    u.total_completed_bookings,
    COUNT(b.id) as active_bookings,
    COALESCE(AVG(r.rating), 0) as average_review_rating
FROM users u
LEFT JOIN bookings b ON u.id = b.provider_id 
    AND b.status IN ('ASSIGNED', 'CONFIRMED', 'IN_PROGRESS')
    AND b.is_deleted = FALSE
LEFT JOIN reviews r ON u.id = r.provider_id AND r.is_deleted = FALSE
WHERE u.role = 'SERVICE_PROVIDER' AND u.is_deleted = FALSE
GROUP BY u.id;

-- Indexes for common queries
CREATE INDEX idx_bookings_provider_status_date ON bookings(provider_id, status, scheduled_time);
CREATE INDEX idx_users_role_rating ON users(role, rating DESC);
CREATE INDEX idx_services_category_popular ON services(category, is_popular, total_bookings DESC);
