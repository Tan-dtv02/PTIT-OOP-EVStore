package com.store.evstore.controller;

import com.store.evstore.model.entity.VehicleModel;
import com.store.evstore.service.VehicleModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicle-models")
@RequiredArgsConstructor
public class VehicleModelController {

    private final VehicleModelService vehicleModelService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','EMPLOYEE')")
    public Page<VehicleModel> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return vehicleModelService.search(keyword, page, size);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','EMPLOYEE')")
    public VehicleModel getById(@PathVariable Long id) {
        return vehicleModelService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','EMPLOYEE')")
    public VehicleModel create(@RequestBody VehicleModel model) {
        return vehicleModelService.create(model);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','EMPLOYEE')")
    public VehicleModel update(@PathVariable Long id, @RequestBody VehicleModel model) {
        return vehicleModelService.update(id, model);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void delete(@PathVariable Long id) {
        vehicleModelService.delete(id);
    }
}
