package com.store.evstore.service;

import com.store.evstore.dto.response.ServiceRecordResponse;
import com.store.evstore.model.entity.Order;
import com.store.evstore.model.entity.ServiceRecord;
import com.store.evstore.repository.OrderRepository;
import com.store.evstore.repository.ServiceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceRecordService {

    private final ServiceRecordRepository repo;
    private final OrderRepository orderRepo;

    // =============================
    // Tạo dịch vụ
    // =============================
    public ServiceRecordResponse create(Long orderId, String serviceName, String description) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (!"Hoàn thành".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Chỉ tạo dịch vụ khi đơn đã Hoàn thành");
        }

        ServiceRecord record = ServiceRecord.builder()
                .order(order)
                .serviceName(serviceName)
                .description(description)
                .status("Chờ xử lý")
                .build();

        record = repo.save(record);

        return toDTO(record);
    }

    // =============================
    // Lấy theo order
    // =============================
    public List<ServiceRecordResponse> getByOrder(Long orderId) {
        return repo.findByOrderIdOrderByCreatedAtDesc(orderId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public ServiceRecordResponse updateStatus(Long id, String status) {
        ServiceRecord record = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

        record.setStatus(status);
        repo.save(record);

        return toDTO(record);
    }


    // =============================
    // Mapping ngay trong service
    // =============================
    private ServiceRecordResponse toDTO(ServiceRecord s) {
        return ServiceRecordResponse.builder()
                .id(s.getId())
                .orderId(s.getOrder().getId())

                .serviceName(s.getServiceName())
                .description(s.getDescription())
                .status(s.getStatus())

                .serviceDate(s.getServiceDate())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())

                .order(ServiceRecordResponse.OrderDTO.builder()
                        .id(s.getOrder().getId())
                        .orderCode(s.getOrder().getOrderCode())
                        .customerName(s.getOrder().getCustomer().getName())
                        .vehicleVin(s.getOrder().getVehicle().getVin())
                        .vehicleModel(s.getOrder().getVehicle().getModel().getModelName())
                        .build()
                )

                .build();
    }
}
