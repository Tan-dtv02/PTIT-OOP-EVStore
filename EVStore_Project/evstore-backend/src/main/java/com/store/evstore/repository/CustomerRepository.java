package com.store.evstore.repository;

import com.store.evstore.model.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Page<Customer> findByNameContainingIgnoreCaseOrPhoneContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByCreatedAtDesc(
            String name, String phone, String email, Pageable pageable
    );

    Page<Customer> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
