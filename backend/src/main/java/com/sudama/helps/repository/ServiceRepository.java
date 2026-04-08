package com.sudama.helps.repository;

import com.sudama.helps.entity.Service;
import com.sudama.helps.enums.ServiceCategory;
import com.sudama.helps.enums.ServiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {

    List<Service> findByStatusAndIsDeletedFalseOrderByDisplayOrderAsc(ServiceStatus status);

    List<Service> findByCategoryAndStatusAndIsDeletedFalse(
        ServiceCategory category, 
        ServiceStatus status
    );

    @Query("SELECT s FROM Service s WHERE s.status = :status " +
           "AND s.isPopular = true AND s.isDeleted = false " +
           "ORDER BY s.totalBookings DESC, s.averageRating DESC")
    List<Service> findPopularServices(@Param("status") ServiceStatus status, Pageable pageable);

    @Query("SELECT s FROM Service s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "AND s.status = 'ACTIVE' AND s.isDeleted = false")
    Page<Service> searchServices(@Param("keyword") String keyword, Pageable pageable);

    Optional<Service> findByIdAndIsDeletedFalse(Long id);

    List<Service> findByIsDeletedFalse();

    @Query("SELECT COUNT(s) FROM Service s WHERE s.isDeleted = false")
    long countByIsDeletedFalse();
}
