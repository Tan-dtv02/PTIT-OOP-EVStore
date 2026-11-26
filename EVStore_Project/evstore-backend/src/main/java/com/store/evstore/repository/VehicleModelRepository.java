package com.store.evstore.repository;

import com.store.evstore.model.entity.VehicleModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleModelRepository extends JpaRepository<VehicleModel, Long> {

    Page<VehicleModel> findByModelNameContainingIgnoreCaseOrBrandContainingIgnoreCaseOrderByCreatedAtDesc(
            String modelName, String brand, Pageable pageable
    );

    Page<VehicleModel> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Optional<VehicleModel> findByModelNameIgnoreCase(String modelName);
}
