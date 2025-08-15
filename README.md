# 🎉 Gatherly

<div align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge" alt="Status" />
  
</div>

<div align="center">
  <h3>🎪 The Ultimate Event Ticketing Platform</h3>
  <p>A modern, full-stack event management and ticketing application built with Next.js 14, TypeScript, and MongoDB. Discover local events, book tickets seamlessly, and manage your own events with ease.</p>
</div>

---

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📱 Screenshots](#-screenshots)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🔧 API Endpoints](#-api-endpoints)
- [🌐 Real-World Usage](#-real-world-usage)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🌟 Features

### 👥 For Attendees

- **Event Discovery**: Browse and search local events by category, location, and date
- **Secure Booking**: Book tickets with validation and confirmation
- **User Profiles**: Manage personal information and booking history
- **Responsive Design**: Seamless experience across all devices
- **Real-time Updates**: Get instant notifications about event changes

### 🎭 For Organizers

- **Event Creation**: Create and manage events with detailed information
- **Ticket Management**: Configure multiple ticket types with pricing
- **Sales Analytics**: Track ticket sales and revenue
- **Event Dashboard**: Comprehensive event management interface
- **Image Upload**: Upload event banners via Cloudinary integration

### 🔐 Security & Authentication

- **NextAuth Integration**: Secure authentication with multiple providers
- **Role-based Access**: Different permissions for attendees and organizers
- **Email Verification**: Secure account verification system
- **Password Security**: Encrypted password storage with bcrypt

---

## � Development Status

### ✅ Completed Features

#### **Database Models & Schemas**

- **User Model**: Complete with authentication, role-based access, email verification
- **Event Model**: Full structure with organizer relations, ticket types, status management
- **Booking Model**: Transaction tracking with user-event relationships
- **Database Connection**: MongoDB Atlas integration with Mongoose ODM

#### **Authentication System**

- **NextAuth.js Integration**: Credentials provider setup
- **Password Security**: bcrypt encryption and validation
- **Email Verification**: OTP-based account verification system
- **User Registration**: Complete signup flow with validation

#### **API Routes**

- **Auth Endpoints**: Sign-up, verification, username validation
- **Event Registration**: Event creation API endpoint
- **Database Health**: Connection testing and error handling

#### **Frontend Components**

- **Homepage**: Responsive landing page with hero section
- **Auth Forms**: Sign-in, sign-up, and OTP verification forms
- **UI Components**: shadcn/ui integration with custom styling
- **Navigation**: Responsive navbar component

#### **Data Validation**

- **Zod Schemas**: Comprehensive validation for all forms and API endpoints
- **Type Safety**: Full TypeScript implementation across components
- **Input Sanitization**: Username, email, password validation with regex patterns

#### **Project Infrastructure**

- **Next.js 14 App Router**: Modern routing with TypeScript
- **Middleware**: Authentication routing and protection
- **Constants Management**: Centralized event status and category constants

### 🔄 In Progress

- **Payment Integration**: Stripe setup for ticket purchases
- **Event Management**: Complete CRUD operations for events
- **User Dashboard**: Profile management and booking history

### 📋 Planned Features

- **Event Discovery**: Search and filtering functionality
- **File Upload**: Cloudinary integration for event images
- **Email Notifications**: Booking confirmations and updates
- **Analytics Dashboard**: Event organizer insights

### 📊 Project Progress

- **Backend Architecture**: 85% Complete
- **Database Design**: 95% Complete
- **Authentication**: 80% Complete
- **Frontend**: 35% Complete
- **API Routes**: 60% Complete

---

## �🛠️ Tech Stack

### Frontend

<div align="center">
  <img src="https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
</div>

### Backend & Database

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas" />
</div>

### Authentication & Validation

<div align="center">
  <img src="https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="NextAuth" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
  <img src="https://img.shields.io/badge/bcrypt-8A2BE2?style=for-the-badge" alt="bcrypt" />
</div>

### Cloud Services

<div align="center">
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

---

## 📱 Screenshots

### 🏠 Homepage

<div align="center">
  <img src="./public/homepage.png" alt="Gatherly Homepage" width="800" />
  <p><em>Modern landing page with hero section and responsive design</em></p>
</div>

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/riteshkrkarn/gatherly.git
   cd gatherly
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URL=your_mongodb_atlas_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Email Configuration (for verification)
   EMAIL_SERVER_HOST=your_smtp_host
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your_email
   EMAIL_SERVER_PASSWORD=your_email_password
   EMAIL_FROM=noreply@gatherly.com
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
gatherly/
├── src/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── (auth)/         # Authentication routes
│   │   ├── api/            # API routes
│   │   ├── events/         # Event pages
│   │   └── dashboard/      # User dashboard
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   └── custom/        # Custom components
│   ├── lib/               # Utility functions
│   │   ├── dbConnect.ts   # Database connection
│   │   └── auth.ts        # Authentication config
│   ├── models/            # MongoDB models
│   │   ├── User.model.ts  # User schema
│   │   ├── Event.model.ts # Event schema
│   │   └── Booking.model.ts # Booking schema
│   ├── schemas/           # Zod validation schemas
│   │   ├── signupValidationSchema.ts
│   │   └── eventValidationSchema.ts
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
├── .env.local            # Environment variables
├── package.json
└── README.md
```

---

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Events

- `GET /api/events` - Get all events

## 🌐 Real-World Usage

### 🎭 Event Organizers

- **Local Businesses**: Restaurants hosting wine tastings, cafes organizing book clubs
- **Educational Institutions**: Universities hosting seminars, workshops, and conferences
- **Community Groups**: Local clubs organizing meetups, charity events, and fundraisers
- **Entertainment Venues**: Concert halls, theaters, and comedy clubs selling tickets

### 🎪 Event Attendees

- **Professionals**: Finding networking events, conferences, and skill-building workshops
- **Students**: Discovering educational seminars, career fairs, and campus events
- **Families**: Finding family-friendly activities, festivals, and community events
- **Enthusiasts**: Booking tickets for hobby-related events, sports, and entertainment

### 💼 Business Applications

- **Corporate Events**: Company meetings, team building activities, and product launches
- **Non-profits**: Fundraising events, awareness campaigns, and volunteer activities
- **Government**: Public meetings, town halls, and community engagement events

---

## 🤝 Contributing

This is a learning and portfolio project, but contributions are welcome! Here's how you can help:

### Ways to Contribute

1. **Bug Reports**: Found a bug? Open an issue with detailed information
2. **Feature Requests**: Have an idea? Create a feature request
3. **Code Contributions**: Fork the repo and submit a pull request
4. **Documentation**: Help improve the documentation

### Development Guidelines

1. Follow TypeScript best practices
2. Use the established project structure
3. Write descriptive commit messages
4. Test your changes thoroughly
5. Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **MongoDB** for the database solution
- **shadcn/ui** for the beautiful UI components
- **Open Source Community** for the incredible tools and libraries

---

<div align="center">
  <p>⭐ Star this repository if you find it helpful!</p>
</div>

---

## 📞 Contact

- **X**: [riteshkrkarn](https://x.com/riteshkrkarn)
- **LinkedIn**: [riteshkrkarn](https://linkedin.com/in/riteshkrkarn)

---

_This project is actively being developed. Check back for updates and new features!_
