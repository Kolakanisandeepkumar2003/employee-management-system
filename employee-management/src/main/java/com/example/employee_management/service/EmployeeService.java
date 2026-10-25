package com.example.employee_management.service;

import com.example.employee_management.entity.Employee;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.EmployeeRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class EmployeeService {

    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Employee not found with ID: " + id
                    )
                );
    }

    @Transactional
    public Employee createEmployee(Employee employee) {
        employee.setId(null);

        if (repository.existsByEmailIgnoreCase(employee.getEmail())) {
            throw new IllegalArgumentException(
                "An employee with this email already exists"
            );
        }

        return repository.save(employee);
    }

    @Transactional
    public Employee updateEmployee(Long id, Employee updated) {
        Employee existing = getEmployeeById(id);

        repository.findByEmailIgnoreCase(updated.getEmail())
                .filter(other -> !other.getId().equals(id))
                .ifPresent(other -> {
                    throw new IllegalArgumentException(
                        "An employee with this email already exists"
                    );
                });

        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setDepartment(updated.getDepartment());
        existing.setSalary(updated.getSalary());

        return repository.save(existing);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        repository.delete(employee);
    }
}