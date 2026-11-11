package com.sanjana.ems.service;

import com.sanjana.ems.entity.Department;
import com.sanjana.ems.repository.DepartmentRepository;
import com.sanjana.ems.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@Transactional
public class DepartmentService {
    private final DepartmentRepository departments;
    private final EmployeeRepository employees;

    public DepartmentService(DepartmentRepository departments, EmployeeRepository employees) {
        this.departments = departments;
        this.employees = employees;
    }

    @Transactional(readOnly = true)
    public List<Department> getAll() { return departments.findAll(); }

    @Transactional(readOnly = true)
    public Department getById(Long id) {
        return departments.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
    }

    public Department create(Department input) {
        if (departments.existsByNameIgnoreCase(input.getName()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Department already exists");
        return departments.save(input);
    }

    public Department update(Long id, Department input) {
        Department existing = getById(id);
        if (departments.existsByNameIgnoreCaseAndIdNot(input.getName(), id))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Department already exists");
        existing.setName(input.getName());
        existing.setDescription(input.getDescription());
        return departments.save(existing);
    }

    public void delete(Long id) {
        Department department = getById(id);
        if (employees.countByDepartmentId(id) > 0)
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "This department has employees. Reassign them before deleting it.");
        departments.delete(department);
    }
}
