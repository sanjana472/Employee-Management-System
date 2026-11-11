package com.sanjana.ems.config;

import com.sanjana.ems.entity.Department;
import com.sanjana.ems.entity.Employee;
import com.sanjana.ems.repository.DepartmentRepository;
import com.sanjana.ems.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedDemoData(DepartmentRepository departments, EmployeeRepository employees) {
        return args -> {
            if (departments.count() > 0 || employees.count() > 0) return;

            Department it = addDepartment(departments, "IT", "Technology and software");
            Department hr = addDepartment(departments, "HR", "Human resources");
            Department finance = addDepartment(departments, "Finance", "Finance and accounts");
            Department marketing = addDepartment(departments, "Marketing", "Marketing and communications");
            Department operations = addDepartment(departments, "Operations", "Business operations");
            Department sales = addDepartment(departments, "Sales", "Sales and customer success");

            addEmployee(employees, "Priya Sharma", "priya.sharma@example.com", "Software Engineer", it, "2025-01-20");
            addEmployee(employees, "Arjun Mehta", "arjun.mehta@example.com", "HR Executive", hr, "2025-01-18");
            addEmployee(employees, "Neha Verma", "neha.verma@example.com", "Accountant", finance, "2025-01-15");
            addEmployee(employees, "Vikram Rao", "vikram.rao@example.com", "Marketing Analyst", marketing, "2025-01-12");
            addEmployee(employees, "Kavya Patel", "kavya.patel@example.com", "Operations Associate", operations, "2025-01-10");
            addEmployee(employees, "Rohan Iyer", "rohan.iyer@example.com", "Sales Executive", sales, "2025-01-08");
        };
    }

    private Department addDepartment(DepartmentRepository repo, String name, String description) {
        Department d = new Department();
        d.setName(name);
        d.setDescription(description);
        return repo.save(d);
    }

    private void addEmployee(EmployeeRepository repo, String name, String email, String role,
                             Department department, String date) {
        Employee e = new Employee();
        e.setName(name);
        e.setEmail(email);
        e.setDesignation(role);
        e.setDepartment(department);
        e.setSalary(new BigDecimal("45000.00"));
        e.setJoiningDate(LocalDate.parse(date));
        repo.save(e);
    }
}
