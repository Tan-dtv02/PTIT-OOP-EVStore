package com.store.evstore.service;

import com.store.evstore.dto.VehicleRequest;
import com.store.evstore.model.entity.Vehicle;
import com.store.evstore.model.entity.VehicleModel;
import com.store.evstore.repository.VehicleModelRepository;
import com.store.evstore.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import com.store.evstore.dto.VehicleResponse;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleModelRepository vehicleModelRepository;

    public Page<VehicleResponse> search(String keyword, String status, String modelName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (keyword == null) keyword = "";
        if (status == null) status = "";

        Page<Vehicle> vehicles;

        if (modelName != null && !modelName.isEmpty()) {
            VehicleModel model = vehicleModelRepository.findByModelNameIgnoreCase(modelName)
                    .orElseThrow(() -> new RuntimeException("Model not found"));

            vehicles = vehicleRepository.findByModelAndStatusContainingIgnoreCaseOrderByCreatedAtDesc(
                    model, status, pageable
            );
        } else {
            vehicles = vehicleRepository.findByVinContainingIgnoreCaseOrColorContainingIgnoreCaseOrderByCreatedAtDesc(
                    keyword, keyword, pageable
            );
        }

        return vehicles.map(v -> VehicleResponse.builder()
                .id(v.getId())
                .vin(v.getVin())
                .color(v.getColor())
                .status(v.getStatus())
                .modelId(v.getModel().getId())
                .modelName(v.getModel().getModelName())
                .build()
        );
    }

    public VehicleResponse create(VehicleRequest req) {
        VehicleModel model = vehicleModelRepository.findById(req.getModelId())
                .orElseThrow(() -> new RuntimeException("Model not found"));

        Vehicle v = Vehicle.builder()
                .model(model)
                .vin(req.getVin())
                .color(req.getColor())
                .status(req.getStatus())
                .build();

        vehicleRepository.save(v);

        return VehicleResponse.builder()
                .id(v.getId())
                .vin(v.getVin())
                .color(v.getColor())
                .status(v.getStatus())
                .modelId(model.getId())
                .modelName(model.getModelName())
                .build();
    }

    public VehicleResponse update(Long id, VehicleRequest req) {
        Vehicle v = findById(id);

        VehicleModel model = vehicleModelRepository.findById(req.getModelId())
                .orElseThrow(() -> new RuntimeException("Model not found"));

        v.setModel(model);
        v.setVin(req.getVin());
        v.setColor(req.getColor());
        v.setStatus(req.getStatus());
        vehicleRepository.save(v);

        return VehicleResponse.builder()
                .id(v.getId())
                .vin(v.getVin())
                .color(v.getColor())
                .status(v.getStatus())
                .modelId(model.getId())
                .modelName(model.getModelName())
                .build();
    }

    private Vehicle findById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    public void delete(Long id) {
        vehicleRepository.deleteById(id);
    }
}
