# StudyFlow: Student Study Planner 🎓

StudyFlow is a full-stack, high-performance study management application designed to help students organize their academic life, track progress, and boost productivity through smart scheduling and deep work tools.

## 🌟 Key Features

- **Dynamic Dashboard**: Real-time overview of upcoming deadlines, subjects, and today's study schedule.
- **Smart Weekly Schedule**: Interactive grid for planning study blocks with automatic "Next Session" reminders.
- **Task Management**: Advanced TODO system with priority levels, task types (Exam, Project, etc.), and time-based reminders.
- **Pomodoro Timer**: Integrated deep-work timer with customizable sessions to maximize focus.
- **Analytics Dashboard**: Visual progress tracking with completion rates and subject distribution.
- **Secure Authentication**: Robust user identity system with JWT-based stateless authentication and protected routes.
- **Personalized Profile**: Customizable student profiles with bio and image support.

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.4.3
- **Language**: Java 21
- **Security**: Spring Security with JWT & HttpOnly Cookies
- **Database**: PostgreSQL
- **Persistence**: Spring Data JPA / Hibernate
- **Tools**: Lombok, Maven

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS with modern glassmorphism design
- **Icons**: Lucide React
- **Routing**: React Router 7

## 🚀 Getting Started

### Prerequisites
- Java 21 or higher
- Node.js & npm
- PostgreSQL instance running on `localhost:5432`

### Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/UmaMaheshwari7474/Student-Study-Planner.git
   cd Student-Study-Planner
   ```

2. **Configure Database**
   Update `backend/src/main/resources/application.properties` with your PostgreSQL credentials.

3. **Run Backend**
   ```bash
   cd backend
   ./mvnw clean compile
   java -cp "target/classes;target/dependency/*" com.example.backend.BackendApplication
   ```

4. **Run Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📸 Project Highlights
- **Architecture**: Separated Frontend and Backend for scalability.
- **Security**: Implements best practices for web security using HttpOnly cookies to mitigate XSS risks.
- **UI/UX**: Premium, responsive design focused on accessibility and ease of use.

---
Developed with ❤️ for students who want to excel.
