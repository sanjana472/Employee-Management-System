# Employee Management System — Premium Full Project

A full-stack employee and department management application built with Java 17, Spring Boot, Spring Data JPA, Hibernate, PostgreSQL, HTML, CSS and JavaScript.

## Included
- Premium dark navy admin dashboard inspired by the supplied design
- Admin display name: Sanjana S J (presentation label only; no login/authentication included)
- Employee CRUD: create, list, update, delete
- Department CRUD: create, list, update, delete
- Employee-to-department relationship
- Dashboard KPIs and charts populated from PostgreSQL records
- Demo seed records on first launch
- Responsive UI
- REST API validation and common error responses

## Requirements
- JDK 17
- Maven 3.6+
- PostgreSQL 14+
- VS Code with Extension Pack for Java

## Step 1 — Create PostgreSQL database
Open pgAdmin 4, connect to your PostgreSQL server, open Query Tool and run:

```sql
CREATE DATABASE employee_management;
```

If the database already exists, do not create it again.

## Step 2 — Configure database credentials
Open:
`src/main/resources/application.properties`

Defaults:
- URL: `jdbc:postgresql://localhost:5432/employee_management`
- Username: `postgres`
- Password: `postgres`

Change the password to your own PostgreSQL password. Better: use environment variables instead:
- Windows PowerShell: `$env:DB_USERNAME="postgres"` and `$env:DB_PASSWORD="your_password"`
- Optional URL: `$env:DB_URL="jdbc:postgresql://localhost:5432/employee_management"`

Never commit real database credentials to a public GitHub repository.

## Step 3 — Open in VS Code
Extract the ZIP, then VS Code → File → Open Folder → select `EMS_Premium_Full_Project`.

## Step 4 — Check tools
In VS Code Terminal:
```powershell
java -version
mvn -version
```
Make sure Java reports version 17.

## Step 5 — Build and run
```powershell
mvn clean install
mvn spring-boot:run
```
Wait for `Started EmployeeManagementApplication`.

## Step 6 — Open the application
Visit:
`http://localhost:8080`

The Spring Boot server serves the dashboard and APIs from the same origin. Internet access is needed for Google Fonts and Chart.js CDN resources; the application data and APIs run locally.

## REST API endpoints

### Employees
- `GET /api/employees`
- `GET /api/employees/{id}`
- `POST /api/employees?departmentId=1`
- `PUT /api/employees/{id}?departmentId=1`
- `DELETE /api/employees/{id}`

Example employee JSON:
```json
{
  "name": "Sanjana S J",
  "email": "sanjana@example.com",
  "phone": "9876543210",
  "designation": "Software Developer",
  "salary": 45000,
  "joiningDate": "2026-11-11"
}
```

### Departments
- `GET /api/departments`
- `GET /api/departments/{id}`
- `POST /api/departments`
- `PUT /api/departments/{id}`
- `DELETE /api/departments/{id}`

Example department JSON:
```json
{
  "name": "Engineering",
  "description": "Software development team"
}
```

### Dashboard
- `GET /api/dashboard/summary`

## Demo data
On the first launch, the application seeds six sample departments and six sample employees only when both tables are empty. You can edit or delete these records through the UI. Sample records are not real employee data.

## Important scope notes
- Attendance, leave, payroll and reports are shown as navigation/design placeholders for future development. The implemented database-backed modules in this version are Employees and Departments.
- The admin name is a visual label. Authentication and role-based access control are not included in this starter.
- The dashboard's attendance metric is intentionally not fabricated; it displays a dash until attendance is implemented.
- `spring.jpa.hibernate.ddl-auto=update` is convenient for local development. Use managed migrations such as Flyway for production.
