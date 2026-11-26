package com.store.evstore.dto;

import lombok.Data;

@Data
public class OrderCreateRequest {
    private Long customerId;
    private Long vehicleId;
}
