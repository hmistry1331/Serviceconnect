# ServiceConnect

ServiceConnect is a full-stack local-services marketplace that connects customers with verified workers such as plumbers, electricians, HVAC technicians, carpenters, painters, cleaners, and roofers.

Customers can create location-aware job requests, receive quotes from nearby workers, select a worker, track job progress, upload before-and-after images, and submit ratings and reviews after completion.

## Features

- Email/password authentication with BCrypt password hashing
- Google OAuth authorization-code login
- JWT-based stateless authentication
- Role-based access for customers, workers, and administrators
- Customer and worker dashboards
- Worker verification and rejection workflow
- City-based location handling for supported Gujarat cities
- Worker job feed with category and 10 km location matching
- Quote submission, selection, and automatic decline of other pending quotes
- Job status workflow from `OPEN` to `COMPLETED` or `CANCELLED`
- AI-assisted service-category classification through Groq
- Profile, before-work, and after-work image uploads through Cloudinary
- Customer ratings and reviews with worker rating summaries
- Service-category administration
- User suspension, deletion, and platform statistics for administrators
- Optional asynchronous quote webhook notifications

## Technology Stack

### Backend

- Java 22
- Spring Boot 4.0
- Spring MVC
- Spring Security
- Spring Data JPA and Hibernate
- Jakarta Bean Validation
- JWT
- PostgreSQL JDBC driver
- Spring AI with the Groq-compatible API
- Cloudinary Java SDK

### Frontend

- React 19
- Vite
- React Router
- Axios
- Zustand
- Tailwind CSS

## Project Structure

```text
ServiceConnect/
├── Backend/
│   ├── src/main/java/
│   │   └── com/labourproject/project/
│   │       ├── config/
│   │       ├── controllers/
│   │       ├── dto/
│   │       ├── entity/
│   │       ├── exceptions/
│   │       ├── repositories/
│   │       ├── security/
│   │       └── service/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

## Core Workflow

```text
Customer creates a job
        ↓
Job starts as OPEN
        ↓
Verified workers discover matching nearby jobs
        ↓
Workers submit quotes
        ↓
Customer selects one quote
        ↓
Job becomes ASSIGNED
        ↓
Worker moves it to IN_PROGRESS
        ↓
Worker completes the job
        ↓
Customer submits a rating and review
```

## Local Development

### Backend

From the `Backend` directory:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

### Frontend

From the `frontend` directory:

```bash
npm install
npm run dev
```

The frontend defaults to the Vite development server. Configure the backend URL and Google client settings through the frontend environment variables.

## Configuration

The backend reads secrets and deployment settings from environment variables, including:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `FRONTEND_URL`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_REDIRECT_URI`
- `GROQ_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `AUTOMATION_QUOTE_WEBHOOK_ENABLED`
- `AUTOMATION_QUOTE_WEBHOOK_URL`
- `AUTOMATION_QUOTE_WEBHOOK_SECRET`

Never commit credentials or environment files to source control.

## Planned Enhancements

- Real-time in-app messaging
- Integrated payment gateway
- Advanced booking and scheduling calendar
- Dispute resolution center
