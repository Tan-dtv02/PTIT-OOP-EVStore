package com.store.evstore.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private String orderCode;
    private String status;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;

    private CustomerDTO customer;
    private VehicleDTO vehicle;

    @Data
    @Builder
    public static class CustomerDTO {
        private Long id;
        private String name;
        private String phone;
        private String email;
        private String address;
    }

    @Data
    @Builder
    public static class VehicleDTO {
        private Long id;
        private String vin;
        private String modelName;
        private String color;
        private BigDecimal price;
    }
}
