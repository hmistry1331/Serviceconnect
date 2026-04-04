# GitHub Copilot Instructions — ServiceConnect (Intelligent Local Service Platform)

## 🧠 Project Overview
ServiceConnect is a web-based marketplace that connects homeowners/users with local
service professionals (plumbers, electricians, HVAC technicians, etc.).
The core feature is an AI-powered dispatcher that uses LangChain to translate
natural language problem descriptions into specific technical job categories.

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Java 25, Spring Boot 3.x            |
| Frontend   | React (separate project)            |
| Database   | MySQL (DB name: serviceconnect)     |
| ORM        | Spring Data JPA / Hibernate         |
| AI Layer   | LangChain + OpenAI or Gemini LLM    |
| API Style  | REST (JSON responses)               |
| Security   | JWT Authentication (upcoming)       |

---

## 📁 Project Package Structure
```
com.labourproject.project
├── dao/          → JPA Repository interfaces only (extend JpaRepository)
├── entity/       → JPA Entity classes (@Entity, @Table)
├── rest/         → REST Controllers (@RestController)
├── service/      → Service layer classes (to be added)
├── security/     → JWT security config (to be added)
└── ProjectApplication.java → main class
```

---

## 📦 Existing Classes (Already Built)

### Entities
- `User.java` — represents a homeowner/client
- `Worker.java` — represents a service professional
- `Job_Requests.java` — represents a service job request

### Repositories (dao/)
- `UserRepository.java`
- `WorkerRepository.java`
- `JobRequestRepository.java`

### Controllers (rest/)
- `AIController.java` — handles AI/LangChain related endpoints
- `ProjectApplication.java` — main Spring Boot entry point

---

## ✅ Coding Conventions — ALWAYS Follow These

1. **Package placement:**
   - New entities → `entity/` package
   - New repos → `dao/` package
   - New controllers → `rest/` package
   - New services → `service/` package (create if not exists)

2. **Dependency Injection:**
   - Always use **constructor injection**, NOT `@Autowired` field injection
   ```java
   // ✅ Correct
   private final UserRepository userRepository;
   public UserService(UserRepository userRepository) {
       this.userRepository = userRepository;
   }

   // ❌ Avoid
   @Autowired
   private UserRepository userRepository;
   ```

3. **REST Controller pattern:**
   - Use `@RestController` and `@RequestMapping`
   - Return `ResponseEntity<>` for all endpoints
   - Use proper HTTP methods: GET, POST, PUT, DELETE

4. **Entity conventions:**
   - Always annotate with `@Entity` and `@Table(name="...")`
   - Primary key: `@Id @GeneratedValue(strategy = GenerationType.IDENTITY)`
   - Use `@Column` for custom column names

5. **Database:**
   - `ddl-auto=update` (do NOT change to create or drop)
   - MySQL on `localhost:3307`, DB: `serviceconnect`

---

## 🔄 Core Business Logic (Reference This When Generating Code)

### User Flow
1. User submits a problem description (text)
2. AI Controller sends text to LangChain service
3. LangChain classifies it → returns `{ "category": "Plumber", "confidence": 0.95 }`
4. Backend finds workers matching that category + location
5. Job request is saved with status: `PENDING`

### Worker Flow
1. Worker sees only jobs matching their trade + location
2. Worker can ACCEPT or REJECT a job
3. Worker marks job as COMPLETED when done

### Job Status Enum (use this for Job_Requests entity)
```java
public enum JobStatus {
    PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, REJECTED
}
```

---

## 🔐 Security (Upcoming — Section 5 of course)
- JWT-based authentication
- Two roles: `ROLE_USER`, `ROLE_WORKER`, `ROLE_ADMIN`
- Secure worker endpoints so only authenticated workers can accept/reject jobs
- Do NOT implement security yet — add a TODO comment instead

---

## 🚧 Development Phases

- [x] **Phase 1** — Foundation: Basic CRUD for User, Worker, Job Requests ✅
- [ ] **Phase 2** — AI Brain: LangChain integration for job classification
- [ ] **Phase 3** — Connection: Filter workers by category + location
- [ ] **Phase 4** — The Loop: Accept/Reject + status updates
- [ ] **Phase 5** — Security: JWT auth for all roles

---

## 💡 Helpful Prompts to Use With Copilot Agent

```
Create a service layer for JobRequests following constructor injection pattern
used in this project

Add a JobStatus enum and update Job_Requests entity to use it

Create a REST endpoint that accepts a problem description string, 
calls AIController logic, and returns the matched worker category

Generate JUnit tests for UserRepository custom queries
```

---

## ⚠️ Important Notes for Copilot
- Do NOT use `@Autowired` — always constructor inject
- Do NOT change `application.properties` database settings
- Do NOT use `ddl-auto=create` or `drop` — always keep `update`
- All AI classification logic belongs in `AIController.java` or a new `AIService.java`
- When adding new features, always check existing entity structure first
