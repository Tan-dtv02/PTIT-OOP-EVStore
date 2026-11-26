package com.store.evstore.repository;

import com.store.evstore.model.entity.Order;
import com.store.evstore.model.entity.VehicleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface DashboardRepository extends JpaRepository<Order, Long> {

    // ======== 1) Revenue by month ========
    @Query("""
                SELECT 
                    FUNCTION('DATE_FORMAT', o.orderDate, '%Y-%m') AS month,
                    SUM(o.totalAmount) AS revenue
                FROM Order o
                WHERE o.status = 'Hoàn thành'
                GROUP BY FUNCTION('DATE_FORMAT', o.orderDate, '%Y-%m')
                ORDER BY month ASC
            """)
    List<Object[]> getRevenueGrowth();


    // ======== 2) Customer growth by month ========
    @Query("""
                SELECT 
                    FUNCTION('DATE_FORMAT', c.createdAt, '%Y-%m') AS month,
                    COUNT(c.id) AS totalCustomers
                FROM Customer c
                GROUP BY FUNCTION('DATE_FORMAT', c.createdAt, '%Y-%m')
                ORDER BY month ASC
            """)
    List<Object[]> getCustomerGrowth();


    // ======== 3) Top Vehicle Model (count vehicle sold) ========
    @Query("""
                SELECT 
                    vm.modelName,
                    COUNT(o.id) AS totalSales
                FROM Order o
                JOIN o.vehicle v
                JOIN v.model vm
                WHERE o.status = 'Hoàn thành'
                GROUP BY vm.modelName
                ORDER BY totalSales DESC
            """)
    List<Object[]> getTopVehicleModels();


    // ======== 4) Recent orders ========
    @Query("""
                SELECT o
                FROM Order o
                ORDER BY o.createdAt DESC
            """)
    List<Order> findRecentOrders();
}
