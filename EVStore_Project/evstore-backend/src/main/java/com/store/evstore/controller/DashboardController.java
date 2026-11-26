package com.store.evstore.controller;

import com.store.evstore.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Map<String, Object> getOverview() {
        return dashboardService.getDashboardData();
    }
}
