package com.store.evstore.service;

import com.store.evstore.model.entity.Customer;
import com.store.evstore.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public Page<Customer> search(String keyword, Pageable pageable) {
        if (keyword == null || keyword.isBlank()) {
            return customerRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        return customerRepository
                .findByNameContainingIgnoreCaseOrPhoneContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByCreatedAtDesc(
                        keyword, keyword, keyword, pageable
                );
    }

    public Customer findById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer create(Customer c) {
        return customerRepository.save(c);
    }

    public Customer update(Long id, Customer c) {
        Customer old = findById(id);
        old.setName(c.getName());
        old.setPhone(c.getPhone());
        old.setEmail(c.getEmail());
        old.setAddress(c.getAddress());
        return customerRepository.save(old);
    }
}
