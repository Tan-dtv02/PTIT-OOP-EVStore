package com.store.evstore.controller;

import com.store.evstore.dto.OrderCreateRequest;
import com.store.evstore.dto.OrderResponse;
import com.store.evstore.model.entity.Order;
import com.store.evstore.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','EMPLOYEE')")
    public Page<OrderResponse> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return orderService.search(keyword, page, size);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','EMPLOYEE')")
    public Order getById(@PathVariable Long id) {
        return orderService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','EMPLOYEE')")
    public OrderResponse create(@RequestBody OrderCreateRequest request, Authentication auth) {
        Long userId = Long.valueOf(auth.getName());
        return orderService.create(request, userId);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ADMIN','EMPLOYEE')")
    public void updateStatus(@PathVariable Long id, @RequestParam String status) {
        orderService.updateStatus(id, status);
    }
}
