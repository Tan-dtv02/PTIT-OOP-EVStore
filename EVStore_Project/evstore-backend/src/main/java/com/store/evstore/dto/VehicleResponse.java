package com.store.evstore.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VehicleResponse {
    private Long id;
    private String vin;
    private String color;
    private String status;
    private String modelName;
    private Long modelId;
}
