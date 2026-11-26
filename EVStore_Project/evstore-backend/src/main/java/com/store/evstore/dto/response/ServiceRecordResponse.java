package com.store.evstore.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ServiceRecordResponse {
    private Long id;
    private Long orderId;

    private String serviceName;
    private String description;
    private String status;

    private LocalDateTime serviceDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Gói gọn thông tin đơn
    private OrderDTO order;

    @Data
    @Builder
    public static class OrderDTO {
        private Long id;
        private String orderCode;
        private String customerName;
        private String vehicleVin;
        private String vehicleModel;
    }
}
