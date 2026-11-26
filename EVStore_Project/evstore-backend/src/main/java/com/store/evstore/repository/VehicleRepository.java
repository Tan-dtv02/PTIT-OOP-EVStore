package com.store.evstore.repository;

import com.store.evstore.model.entity.Vehicle;
import com.store.evstore.model.entity.VehicleModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Page<Vehicle> findByVinContainingIgnoreCaseOrColorContainingIgnoreCaseOrderByCreatedAtDesc(
            String vin, String color, Pageable pageable
    );

    Page<Vehicle> findByModelAndStatusContainingIgnoreCaseOrderByCreatedAtDesc(
            VehicleModel model, String status, Pageable pageable
    );
}
