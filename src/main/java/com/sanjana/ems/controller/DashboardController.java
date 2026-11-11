package com.sanjana.ems.controller;

import com.sanjana.ems.repository.DepartmentRepository;
import com.sanjana.ems.repository.EmployeeRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final EmployeeRepository employees;
    private final DepartmentRepository departments;

    public DashboardController(EmployeeRepository employees, DepartmentRepository departments) {
        this.employees = employees;
        this.departments = departments;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        long total = employees.count();
        return Map.of(
            "totalEmployees", total,
            "activeEmployees", total,
            "departments", departments.count(),
            "attendancePresent", 0,
            "attendancePercentage", 0
        );
    }
}
