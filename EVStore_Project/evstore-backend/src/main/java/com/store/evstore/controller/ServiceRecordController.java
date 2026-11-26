package com.store.evstore.controller;

import com.store.evstore.dto.response.ServiceRecordResponse;
import com.store.evstore.service.ServiceRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceRecordController {

    private final ServiceRecordService service;

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('ADMIN','EMPLOYEE')")
    public ServiceRecordResponse create(
            @RequestParam Long orderId,
            @RequestParam String serviceName,
            @RequestParam(required = false) String description
    ) {
        return service.create(orderId, serviceName, description);
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyAuthority('ADMIN','EMPLOYEE')")
    public List<ServiceRecordResponse> getByOrder(@PathVariable Long orderId) {
        return service.getByOrder(orderId);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ADMIN','EMPLOYEE')")
    public ServiceRecordResponse updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return service.updateStatus(id, status);
    }
}
