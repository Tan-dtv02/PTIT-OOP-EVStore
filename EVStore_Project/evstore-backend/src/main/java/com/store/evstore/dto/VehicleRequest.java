package com.store.evstore.dto;

import lombok.Data;

@Data
public class VehicleRequest {
    private Long modelId;
    private String vin;
    private String color;
    private String status;
}
