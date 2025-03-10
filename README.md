# VeredaMarket Backend

A comprehensive Node.js/TypeScript backend service for VeredaMarket, an agricultural e-commerce platform that facilitates connections between farmers and customers.

## 🌟 Features

- **Authentication System**
  - Email and phone verification to ensure user authenticity
  - Secure login with rate limiting to prevent brute force attacks
  - Password recovery system with secure random password generation
  - JWT-based authentication for stateless sessions

- **WhatsApp Integration**
  - Chatbot functionality for automated customer interactions
  - Automated notifications and alerts
  - Support for sending stickers and media

- **User Management**
  - Farmer registration with detailed profile management
  - Family capacity tracking for better resource allocation
  - Admin dashboard for managing users and roles

- **Farm Management**
  - Register and manage farm profiles, including land type and housing location
  - Validate farm data to ensure completeness and accuracy
  - Prevent duplicate farm registrations

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM for database interactions
- **Authentication**: JWT, bcrypt for password hashing
- **Email Service**: Nodemailer for sending verification and notification emails
- **WhatsApp Integration**: whatsapp-web.js for chatbot and messaging
- **Other Tools**: 
  - Puppeteer for web automation tasks
  - Express Rate Limit for protecting APIs
  - CORS for handling cross-origin requests

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version)
- MySQL Server
- TypeScript

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/veredamarketBack.git
   cd veredamarketBack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database Configuration
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name

   # JWT Configuration
   JWT_SECRET=your_jwt_secret

   # Email Configuration
   EMAIL_HOST=your_email_host
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   ```

4. Build and run the project:
   ```bash
   # Watch TypeScript files
   npm run typescript

   # Run development server
   npm run dev

   # Start WhatsApp bot (optional)
   npm run start-bot
   ```

## 📁 Project Structure

```
src/
├── agroIinova/
│   ├── admin/         # Admin dashboard functionality
│   ├── auth/          # Authentication modules
│   │   ├── chatbot/   # WhatsApp bot integration
│   │   ├── email/     # Email verification
│   │   └── login/     # Login and password recovery
│   └── clientes/      # Client management
│       └── controllers/
│           └── registercampesino/
│               └── registerFamilyCapController.ts # Farm profile registration
```

## 🔒 Security Features

- Password hashing with bcrypt for secure storage
- Rate limiting to protect against brute force attacks
- JWT-based authentication for secure session management
- Email and phone verification to prevent fake accounts
- Secure password recovery process

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## ✨ Acknowledgments

- Thanks to all contributors who have helped shape VeredaMarket
- Special thanks to the open-source community for the amazing tools and libraries


