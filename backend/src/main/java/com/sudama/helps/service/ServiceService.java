package com.sudama.helps.service;

import com.sudama.helps.entity.Service;
import com.sudama.helps.exception.ResourceNotFoundException;
import com.sudama.helps.repository.ServiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Service offering management
 */
@org.springframework.stereotype.Service
public class ServiceService {

    private static final Logger log = LoggerFactory.getLogger(ServiceService.class);

    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @Cacheable(value = "services")
    @Transactional(readOnly = true)
    public List<Service> getAllServices() {
        log.info("Fetching all active services");
        return serviceRepository.findByIsDeletedFalse();
    }

    @Cacheable(value = "services", key = "#id")
    @Transactional(readOnly = true)
    public Service getServiceById(Long id) {
        log.info("Fetching service with id: {}", id);
        return serviceRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
    }

    @Transactional(readOnly = true)
    public List<Service> getPopularServices() {
        log.info("Fetching popular services");
        // Simplified logic: return first 5 services
        return serviceRepository.findByIsDeletedFalse().stream().limit(5).toList();
    }
}
