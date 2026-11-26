package com.store.evstore.repository;

import com.store.evstore.model.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Order findByOrderCode(String orderCode);

    @Query("""
        SELECT o FROM Order o
        JOIN o.customer c
        WHERE (:keyword IS NULL OR :keyword = '' 
               OR LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(c.phone) LIKE LOWER(CONCAT('%', :keyword, '%')))
        ORDER BY o.createdAt DESC
        """)
    Page<Order> search(String keyword, Pageable pageable);

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
