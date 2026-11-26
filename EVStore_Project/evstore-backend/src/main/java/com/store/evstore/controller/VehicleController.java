package com.store.evstore.controller;

import com.store.evstore.dto.VehicleRequest;
import com.store.evstore.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.store.evstore.dto.VehicleResponse;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','EMPLOYEE')")
    public Page<VehicleResponse> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, name = "model") String modelName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return vehicleService.search(keyword, status, modelName, page, size);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','EMPLOYEE')")
    public VehicleResponse create(@RequestBody VehicleRequest req) {
        return vehicleService.create(req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','EMPLOYEE')")
    public VehicleResponse update(@PathVariable Long id, @RequestBody VehicleRequest req) {
        return vehicleService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void delete(@PathVariable Long id) {
        vehicleService.delete(id);
    }
}
