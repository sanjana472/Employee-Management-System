package com.sanjana.ems.service;

import com.sanjana.ems.entity.Department;
import com.sanjana.ems.entity.Employee;
import com.sanjana.ems.repository.DepartmentRepository;
import com.sanjana.ems.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@Transactional
public class EmployeeService {
    private final EmployeeRepository employees;
    private final DepartmentRepository departments;

    public EmployeeService(EmployeeRepository employees, DepartmentRepository departments) {
        this.employees = employees;
        this.departments = departments;
    }

    @Transactional(readOnly = true)
    public List<Employee> getAll() { return employees.findAll(); }

    @Transactional(readOnly = true)
    public Employee getById(Long id) {
        return employees.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
    }

    public Employee create(Employee input, Long departmentId) {
        if (employees.existsByEmail(input.getEmail()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        input.setDepartment(findDepartment(departmentId));
        return employees.save(input);
    }

    public Employee update(Long id, Employee input, Long departmentId) {
        Employee existing = getById(id);
        if (employees.existsByEmailAndIdNot(input.getEmail(), id))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        existing.setName(input.getName());
        existing.setEmail(input.getEmail());
        existing.setPhone(input.getPhone());
        existing.setDesignation(input.getDesignation());
        existing.setSalary(input.getSalary());
        existing.setJoiningDate(input.getJoiningDate());
        existing.setDepartment(findDepartment(departmentId));
        return employees.save(existing);
    }

    public void delete(Long id) { employees.delete(getById(id)); }

    private Department findDepartment(Long id) {
        if (id == null) return null;
        return departments.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
    }
}
