package com.sanjana.ems.controller;

import com.sanjana.ems.entity.Employee;
import com.sanjana.ems.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService service;
    public EmployeeController(EmployeeService service) { this.service = service; }

    @GetMapping public List<Employee> getAll() { return service.getAll(); }
    @GetMapping("/{id}") public Employee getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Employee create(@Valid @RequestBody Employee employee,
                           @RequestParam(required = false) Long departmentId) {
        return service.create(employee, departmentId);
    }

    @PutMapping("/{id}")
    public Employee update(@PathVariable Long id, @Valid @RequestBody Employee employee,
                           @RequestParam(required = false) Long departmentId) {
        return service.update(id, employee, departmentId);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        service.delete(id);
        return Map.of("message", "Employee deleted successfully");
    }
}
