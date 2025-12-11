# Global IP Intelligence Platform - Frontend

A React-based web application providing user authentication, role-based dashboards, and IP intelligence analytics with a modern, responsive UI.

## 🚀 Features

- **Authentication System**
  - JWT-based authentication
  - OAuth2 Google Sign-In integration
  - Secure login and registration

- **Role-Based Dashboards**
  - Admin Dashboard - User management and system administration
  - Analyst Dashboard - IP analysis and threat intelligence
  - User Dashboard - Personal IP monitoring and reports

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Interactive data visualization with Recharts
  - Clean and intuitive interface

## 📋 Prerequisites

- **React** installed
- **npm** (comes with React)
- Backend API running on `http://localhost:8080`

## 🛠️ Tech Stack

- **React** 19.2.1 - UI framework
- **React Router** 7.10.1 - Navigation
- **Axios** 1.13.2 - HTTP client
- **Tailwind CSS** 3.4.18 - Styling
- **Recharts** 3.5.1 - Data visualization
- **@react-oauth/google** 0.12.2 - Google OAuth integration

## 📦 Installation

1. Navigate to the frontend directory:
```bash
cd GlobalIpFrontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment (optional):
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🚀 Running the Application

### Development Mode
```bash
npm start
```
The application will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `build` folder

### Run Tests
```bash
npm test
```

## 📁 Project Structure

```
GlobalIpFrontend/
├── public/                 # Static files
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── api/               # API configuration
│   │   └── axios.js       # Axios setup
│   ├── components/        # React components
│   │   ├── AdminDashboard.jsx
│   │   ├── AnalystDashboard.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── OAuth2RedirectHandler.jsx
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   ├── App.js            # Main application component
│   ├── App.css           # App styles
│   ├── index.js          # Entry point
│   ├── index.css         # Global styles
│   └── main.jsx          # Alternative entry point
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔑 Key Components

### Authentication Components
- **Login.jsx** - User login with JWT and OAuth2
- **Register.jsx** - New user registration
- **OAuth2RedirectHandler.jsx** - Handles OAuth2 callback

### Dashboard Components
- **AdminDashboard.jsx** - Administrative interface for user management
- **AnalystDashboard.jsx** - IP analysis tools and visualizations
- **UserDashboard.jsx** - End-user interface for personal monitoring

## 🌐 API Integration

The frontend communicates with the backend API through Axios. Configuration is in `src/api/axios.js`.

**Base URL:** `http://localhost:8080` (configured via proxy in package.json)

**Authentication:**
- Token stored in localStorage after login
- Automatically included in API requests via Axios interceptors

## 🎨 Styling

This project uses **Tailwind CSS** for styling:
- Configuration: `tailwind.config.js`
- PostCSS plugins: `postcss.config.js`
- Global styles: `src/index.css`

## 📊 Data Visualization

Uses **Recharts** for interactive charts and graphs.

## 🧪 Testing

The project includes:
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction testing

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run development server (port 3000) |
| `npm run build` | Create production build |
| `npm test` | Run test suite |
| `npm run eject` | Eject from Create React App (irreversible) |

## 🔧 Configuration

### Proxy Configuration
API requests are proxied to the backend. In `package.json`:
```json
"proxy": "http://localhost:8080"
```

## 🚀 Deployment

Build for production and deploy to:
- **Vercel**
- **Netlify**
- **AWS S3 + CloudFront**
- **Azure Static Web Apps**

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### API requests failing
- Verify backend is running on port 8080
- Check proxy configuration in `package.json`
- Open browser console to check for errors

### npm install fails
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/)
- [Axios Documentation](https://axios-http.com/)

---

**Happy Coding! 🚀**
