package com.store.evstore.repository;

import com.store.evstore.model.entity.ServiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRecordRepository extends JpaRepository<ServiceRecord, Long> {
    boolean existsByOrderId(Long orderId);

    List<ServiceRecord> findByOrderIdOrderByCreatedAtDesc(Long orderId);
}
