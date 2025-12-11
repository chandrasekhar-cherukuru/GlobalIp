# Global IP Intelligence Platform - Backend

A Spring Boot-based REST API backend for the Global IP Intelligence Platform, providing secure authentication, role-based access control, and IP intelligence services.

## 🚀 Features

- **Security & Authentication**
  - JWT-based authentication
  - OAuth2 Google Sign-In integration
  - Role-based access control (Admin, Analyst, User)
  - Spring Security integration

- **RESTful API**
  - User management endpoints
  - Profile management
  - Role-specific controllers
  - Secure API endpoints

- **Database Integration**
  - JPA/Hibernate ORM
  - MySQL database support
  - User and profile management

## 📋 Prerequisites

- **Java 21** or higher
- **Maven 3.6+**
- **MySQL 8.0+**
- IDE (IntelliJ IDEA, Eclipse, or VS Code with Java extensions)

## 🛠️ Tech Stack

- **Spring Boot** 3.5.5 - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Data persistence
- **MySQL** - Database
- **JWT** - Token-based authentication
- **OAuth2** - Google Sign-In integration
- **Lombok** 1.18.34 - Reduce boilerplate code
- **Maven** - Build tool

## 📦 Installation

1. Navigate to the backend directory:
```bash
cd GlobalIpBackend
```

2. Configure MySQL database:
```sql
CREATE DATABASE ip_intelligence;
```

3. Update database credentials in `src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ip_intelligence
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# JWT Configuration
jwt.secret=your-secret-key-change-in-production
jwt.expiration=86400000

# OAuth2 Configuration
spring.security.oauth2.client.registration.google.client-id=your-google-client-id
spring.security.oauth2.client.registration.google.client-secret=your-google-client-secret

# Server Configuration
server.port=8080
```

4. Build the project:
```bash
./mvnw clean install
```

## 🚀 Running the Application

### Using Maven Wrapper (Recommended)
```bash
./mvnw spring-boot:run
```

### Using Maven
```bash
mvn spring-boot:run
```

### Using Java
```bash
java -jar target/ip-backend-0.0.1-SNAPSHOT.jar
```

The application will start on `http://localhost:8080`

## 📁 Project Structure

```
GlobalIpBackend/
├── src/
│   ├── main/
│   │   ├── java/com/ipintelligence/
│   │   │   ├── config/              # Security and app configuration
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── OAuth2AuthenticationSuccessHandler.java
│   │   │   ├── controller/          # REST API controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── AdminController.java
│   │   │   │   ├── AnalystController.java
│   │   │   │   ├── ClientController.java
│   │   │   │   └── ProfileController.java
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── AuthRequest.java
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   ├── ProfileRequest.java
│   │   │   │   ├── ProfileResponse.java
│   │   │   │   └── UserDto.java
│   │   │   ├── model/               # Entity models
│   │   │   │   └── User.java
│   │   │   ├── security/            # Security components
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── CustomUserDetailsService.java
│   │   │   └── service/             # Business logic
│   │   │       ├── AuthService.java
│   │   │       └── AuthServiceImpl.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/                        # Unit and integration tests
├── target/                          # Build output
├── mvnw                            # Maven wrapper (Unix)
├── mvnw.cmd                        # Maven wrapper (Windows)
├── pom.xml                         # Maven configuration
└── README.md                       # This file
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/oauth2/google` | Google OAuth2 login |

### Profile Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/profile` | Get user profile | Required |
| PUT | `/api/profile` | Update user profile | Required |

### Admin Endpoints
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/admin/users` | List all users | ADMIN |
| PUT | `/api/admin/users/{id}` | Update user | ADMIN |
| DELETE | `/api/admin/users/{id}` | Delete user | ADMIN |

### Analyst Endpoints
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/analyst/ip-analysis` | IP analysis data | ANALYST |
| POST | `/api/analyst/reports` | Create reports | ANALYST |

### User Endpoints
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/user/dashboard` | User dashboard data | USER |
| GET | `/api/user/reports` | User reports | USER |

## 🔐 Security

### JWT Authentication
- Tokens issued upon successful login
- Include token in Authorization header: `Bearer <token>`
- Token expiration: 24 hours (configurable)

### OAuth2 Integration
- Google Sign-In support
- Automatic user creation on first OAuth2 login
- Secure redirect handling

### Role-Based Access Control
- **ADMIN** - Full system access
- **ANALYST** - Analysis and reporting access
- **USER** - Basic user access

## 🗄️ Database Schema

Key entities:
- **User** - User accounts with roles and credentials
- **Profile** - Extended user information

## 🧪 Testing

Run tests:
```bash
./mvnw test
```

Run specific test class:
```bash
./mvnw test -Dtest=IpBackendApplicationTests
```

## 📝 Configuration

### Key Application Properties
- Database connection
- JWT settings
- OAuth2 credentials
- Server port
- CORS settings
- Logging levels

### Maven Dependencies
Major dependencies in `pom.xml`:
- Spring Boot Starter Web
- Spring Boot Starter Security
- Spring Boot Starter Data JPA
- MySQL Connector
- JWT libraries
- Lombok
- OAuth2 Client

## 🚀 Deployment

### Building for Production
```bash
./mvnw clean package -DskipTests
```

### Running Production Build
```bash
java -jar target/ip-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### Docker Deployment (Optional)
```dockerfile
FROM openjdk:21-jdk-slim
VOLUME /tmp
COPY target/ip-backend-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

Build and run:
```bash
docker build -t ip-backend .
docker run -p 8080:8080 ip-backend
```

## 🔧 Environment Variables

Set these for production:
```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://prod-host:3306/ip_intelligence
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=prod_password
export JWT_SECRET=production-secret-key
export GOOGLE_CLIENT_ID=prod-google-client-id
export GOOGLE_CLIENT_SECRET=prod-google-client-secret
```

## 🐛 Troubleshooting

### Common Issues

**Port 8080 already in use:**
```bash
# Change port in application.properties
server.port=8081
```

**Database connection failed:**
- Verify MySQL is running
- Check database credentials
- Ensure database exists

**JWT token errors:**
- Verify JWT secret is configured
- Check token expiration settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [JWT Introduction](https://jwt.io/introduction)

---

**Version:** 0.0.1-SNAPSHOT  
**Java Version:** 21
