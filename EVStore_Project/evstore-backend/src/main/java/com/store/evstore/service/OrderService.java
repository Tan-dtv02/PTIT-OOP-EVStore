package com.store.evstore.service;

import com.store.evstore.dto.OrderCreateRequest;
import com.store.evstore.dto.OrderResponse;
import com.store.evstore.model.entity.Customer;
import com.store.evstore.model.entity.Order;
import com.store.evstore.model.entity.User;
import com.store.evstore.model.entity.Vehicle;
import com.store.evstore.repository.CustomerRepository;
import com.store.evstore.repository.OrderRepository;
import com.store.evstore.repository.UserRepository;
import com.store.evstore.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    // ===========================================
    // 🟦 Convert ENTITY → DTO
    // ===========================================
    private OrderResponse toDTO(Order o) {
        return OrderResponse.builder()
                .id(o.getId())
                .orderCode(o.getOrderCode())
                .status(o.getStatus())
                .totalAmount(o.getTotalAmount())
                .createdAt(o.getCreatedAt())
                .customer(OrderResponse.CustomerDTO.builder()
                        .id(o.getCustomer().getId())
                        .name(o.getCustomer().getName())
                        .phone(o.getCustomer().getPhone())
                        .email(o.getCustomer().getEmail())
                        .address(o.getCustomer().getAddress())
                        .build()
                )
                .vehicle(OrderResponse.VehicleDTO.builder()
                        .id(o.getVehicle().getId())
                        .vin(o.getVehicle().getVin())
                        .modelName(o.getVehicle().getModel().getModelName())
                        .color(o.getVehicle().getColor())
                        .price(o.getVehicle().getModel().getBasePrice())
                        .build()
                )
                .build();
    }

    // ===========================================
    // 🔍 Search (Paging)
    // ===========================================
    public Page<OrderResponse> search(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Order> data = (keyword == null || keyword.isBlank())
                ? orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                : orderRepository.search(keyword, pageable);

        return data.map(this::toDTO);
    }

    public Order findById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // ===========================================
    // 🟩 Create Order (NO DOUBLE INSERT)
    // ===========================================
    @Transactional
    public OrderResponse create(OrderCreateRequest req, Long userId) {

        Customer customer = customerRepository.findById(req.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vehicle vehicle = vehicleRepository.findById(req.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        // 🔥 Cập nhật trạng thái xe và lưu lại ngay lập tức
        vehicle.setStatus("Đã bán");
        vehicleRepository.save(vehicle);

        // 🔥 Tạo order mới
        Order order = Order.builder()
                .orderCode("ORD-" + Long.toHexString(System.currentTimeMillis()).toUpperCase())
                .customer(customer)
                .createdBy(creator)
                .vehicle(vehicle)
                .status("Đang xử lý")
                .totalAmount(vehicle.getModel().getBasePrice())
                .build();

        Order saved = orderRepository.save(order);

        // 🔥 Trả về DTO, không trả về ENTITY
        return toDTO(saved);
    }

    // ===========================================
    // 🟧 Update Status
    // ===========================================
    public void updateStatus(Long id, String status) {
        Order order = findById(id);
        order.setStatus(status);
        orderRepository.save(order);
    }
}
