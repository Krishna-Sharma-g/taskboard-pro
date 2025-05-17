# TaskBoard Pro

![image](https://github.com/user-attachments/assets/61ef8ab1-e2e1-4823-994c-86554d2d4aab)


A modern, feature-rich project management application with task tracking, team collaboration, badge recognition system, and workflow automation.

## 📸 Screenshots
the login page 
![image](https://github.com/user-attachments/assets/b4224f27-204c-48be-9226-9ee529f5e171)

the dashboard 
![image](https://github.com/user-attachments/assets/a54501ff-9c91-4900-a9d9-479308323b6e)

the project details and status page 

![image](https://github.com/user-attachments/assets/f29e7b58-840f-4068-8ff3-71057a98d863)

the automation page 

![image](https://github.com/user-attachments/assets/e257ff0e-1fbf-4654-b801-49b2bd041bed)

the badge page
![image](https://github.com/user-attachments/assets/75fb9d16-21b5-457f-a1ff-5e847d6531cb)


## 🚀 Technology Stack

### Frontend
- **React.js**: UI component library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **Context API**: State management
- **CSS3**: Custom styling with modern features
- **LocalStorage**: JWT token persistence

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **Bcrypt.js**: Password hashing

### Development & Deployment
- **Git**: Version control
- **npm/yarn**: Package management
- **Vite**: Frontend build tool
- **Nodemon**: Development server
- **Vercel**: Frontend deployment
- **Render/Heroku**: Backend deployment
- **MongoDB Atlas**: Cloud database

## ✨ Features

### User Management
- Secure registration and login with JWT authentication
- User profiles with earned badges
- Role-based access control

### Project Management
- Create and manage multiple projects
- Invite team members via email
- Customizable project settings

### Task Management
- Interactive Kanban board with drag-and-drop
- Task creation with title, description, due date, and assignee
- Status tracking and updates

### Badge & Recognition System
- Award badges to tasks and users
- Multiple badge types (Completed, On Time, Star Performer, etc.)
- Badge statistics and leaderboards

### Automation System
- Create custom workflow rules
- Multiple trigger types (status change, assignee change, due date)
- Various actions (change status, assign user, add badge)

### UI/UX
- Modern dark theme interface
- Responsive design for all devices
- Intuitive navigation and interactions

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/taskboard-pro.git
cd taskboard-pro

# Install backend dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start the backend server
npm run dev
