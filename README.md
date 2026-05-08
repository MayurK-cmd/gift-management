# Occasio

A full-stack web application for managing gifts and events. Users can create events, share them with others, and track gifts for each event.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Event Management**: Create events (birthdays, weddings, holidays, etc.)
- **Event Sharing**: Share events with other users via email
- **Gift Tracking**: Add, view, update, and delete gifts for events
- **Gift Details**: Track gift name, description, type, and who gifted it
- **Responsive Design**: Works on desktop and mobile devices
- **API Documentation**: Interactive API documentation with Swagger

## Tech Stack

### Backend
- Node.js with Express.js
- PostgreSQL database with Prisma ORM
- JWT for authentication
- Swagger for API documentation

### Frontend
- React 19 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for HTTP requests
- React Toastify for notifications

## Project Structure

```
gift-management/
├── backend/                  # Backend server
│   ├── src/                  # Source code
│   ├── prisma/               # Database schema and migrations
│   ├── package.json          # Backend dependencies
│   └── ...                   # Other backend files
├── frontend/                 # Frontend application
│   ├── src/                  # React source code
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service
│   │   └── ...               # Other frontend files
│   ├── package.json          # Frontend dependencies
│   └── ...                   # Other frontend files
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gift-management
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Configure environment variables:
   - Create a `.env` file in the `backend` directory:
     ```
     PORT=3000
     DATABASE_URL="postgresql://username:password@localhost:5432/gift_management"
     JWT_SECRET="your-secret-key-here"
     ```
   - Replace the values with your actual database credentials and a strong JWT secret.

5. Initialize the database:
   ```bash
   cd ../backend
   npx prisma migrate dev --name init
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
   The server will run on `http://localhost:3000`

2. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

3. Access the application:
   - Open your browser and go to `http://localhost:5173`
   - API documentation is available at `http://localhost:3000/api-docs`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Events
- `POST /events/newevent` - Create a new event
- `GET /events/getevent` - Get events created by the user
- `GET /events/getSharedEvents` - Get events shared with the user
- `POST /events/shareevent` - Share an event with another user

### Gifts
- `POST /gifts` - Create a new gift for an event
- `GET /gifts` - Get all gifts for a specific event (requires `eventId` query parameter)
- `PUT /gifts/:id` - Update a gift
- `DELETE /gifts/:id` - Delete a gift

## Environment Variables

### Backend (.env file)
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | `3000` |
| DATABASE_URL | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| JWT_SECRET | Secret key for JWT tokens | `your-super-secret-key` |

## Deployment

### Backend Deployment
The backend can be deployed to any Node.js hosting platform (Render, Heroku, AWS, etc.) with:
- Node.js environment
- PostgreSQL database
- Environment variables configured

### Frontend Deployment
The frontend can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.) after building:
```bash
cd frontend
npm run build
```
This will generate optimized static files in the `dist` directory.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For questions or support, please open an issue in the repository.
