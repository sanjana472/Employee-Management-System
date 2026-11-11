package com.sanjana.ems.repository;

import com.sanjana.ems.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);
    long countByDepartmentId(Long departmentId);
    List<Employee> findTop5ByOrderByIdDesc();
}
