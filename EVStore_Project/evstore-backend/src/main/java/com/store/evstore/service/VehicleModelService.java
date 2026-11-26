package com.store.evstore.service;

import com.store.evstore.model.entity.VehicleModel;
import com.store.evstore.repository.VehicleModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VehicleModelService {

    private final VehicleModelRepository vehicleModelRepository;

    public Page<VehicleModel> search(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (keyword == null || keyword.isBlank()) {
            return vehicleModelRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        return vehicleModelRepository
                .findByModelNameContainingIgnoreCaseOrBrandContainingIgnoreCaseOrderByCreatedAtDesc(
                        keyword, keyword, pageable
                );
    }

    public VehicleModel findById(Long id) {
        return vehicleModelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Model not found"));
    }

    public VehicleModel create(VehicleModel model) {
        model.setId(null);
        return vehicleModelRepository.save(model);
    }

    public VehicleModel update(Long id, VehicleModel m) {
        VehicleModel old = findById(id);
        old.setModelName(m.getModelName());
        old.setBrand(m.getBrand());
        old.setBatteryCapacity(m.getBatteryCapacity());
        old.setRangeKm(m.getRangeKm());
        old.setBasePrice(m.getBasePrice());
        return vehicleModelRepository.save(old);
    }

    public void delete(Long id) {
        vehicleModelRepository.deleteById(id);
    }
}
