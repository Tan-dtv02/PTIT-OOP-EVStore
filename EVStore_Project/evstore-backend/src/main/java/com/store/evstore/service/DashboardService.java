package com.store.evstore.service;

import com.store.evstore.model.entity.Order;
import com.store.evstore.repository.DashboardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardRepository dashboardRepo;

    public Map<String, Object> getDashboardData() {

        // ===== Revenue Growth =====
        var revenue = dashboardRepo.getRevenueGrowth().stream()
                .map(row -> Map.of(
                        "month", (String) row[0],
                        "revenue", row[1]
                )).toList();

        // ===== Customer Growth =====
        var customers = dashboardRepo.getCustomerGrowth().stream()
                .map(row -> Map.of(
                        "month", (String) row[0],
                        "customers", row[1]
                )).toList();

        // ===== Top Vehicle Models =====
        var topModels = dashboardRepo.getTopVehicleModels().stream()
                .map(row -> Map.of(
                        "modelName", (String) row[0],
                        "totalSales", row[1]
                )).toList();

        // ===== Recent Orders (limit 5) =====
        var recentOrders = dashboardRepo.findRecentOrders().stream()
                .limit(5)
                .map(o -> Map.of(
                        "orderCode", o.getOrderCode(),
                        "customer", o.getCustomer().getName(),
                        "totalAmount", o.getTotalAmount(),
                        "date", o.getCreatedAt()
                )).toList();

        return Map.of(
                "revenueGrowth", revenue,
                "customerGrowth", customers,
                "topVehicleModels", topModels,
                "recentOrders", recentOrders
        );
    }
}
