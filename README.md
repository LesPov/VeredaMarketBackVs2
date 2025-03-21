# DenunciasBack

A comprehensive Node.js/TypeScript backend service for Denuncias, an agricultural e-commerce platform that facilitates connections between farmers and customers.

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
   git clone https://github.com/yourusername/DenunciasBack.git
   cd DenunciasBack
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

The project is organized as follows:

```
└── 📁src
    └── 📁agroIinova
        └── 📁admin
            └── 📁auth-users
                └── 📁controllers
                └── 📁middleware
                └── 📁routes
            └── 📁middleware
            └── 📁profile-users
                └── 📁controllers
                └── 📁middleware
                └── 📁routes
            └── 📁routes
        └── 📁auth
            └── 📁chatbot
            └── 📁email
                └── 📁controller
                └── 📁middleware
                └── 📁resendCode
                └── 📁routes
                └── 📁utils
            └── 📁emailtemplates
            └── 📁login
                └── 📁controller
                └── 📁passwordRecovery
                └── 📁resetPassword
                └── 📁routes
                └── 📁utils
            └── 📁middleware
            └── 📁pais
            └── 📁phone
            └── 📁profile
            └── 📁register
            └── 📁success
            └── 📁validations
        └── 📁user
            └── 📁controller
            └── 📁denuncias
                └── 📁denunciasAnonimas
                └── 📁denunciasOficiales
                └── 📁middleware
                └── 📁subtiposDeDenuncias
                └── 📁tiposDeDenuncias
            └── 📁middleware
    └── 📁database
    └── 📁services
    └── index.ts

## ⚙️ Setup and Configuration

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Denuncias
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   - Create a `.env` file in the root directory.
   - Add the necessary environment variables as shown in `.env.example`.

## 💻 Usage

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## 🧪 Testing

- Run tests using the following command:
  ```bash
  npm test
  ```

## 🚀 Deployment

- Ensure all environment variables are set appropriately.
- Build the application using:
  ```bash
  npm run build
  ```
- Deploy the contents of the `dist` directory to your server.

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security Features

- Password hashing with bcrypt for secure storage
- Rate limiting to protect against brute force attacks
- JWT-based authentication for secure session management
- Email and phone verification to prevent fake accounts
- Secure password recovery process

## 📝 Acknowledgments

- Thanks to all contributors who have helped shape Denuncias
- Special thanks to the open-source community for the amazing tools and libraries
