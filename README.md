# Next.js Boilerplate

A modern, production-ready Next.js boilerplate built with the latest technologies and best practices.

## Features

- **Next.js 15** - Latest version with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Dark Mode** - Built-in theme switching
- **Cookie Authentication** - Secure JWT-based auth
- **Feature-based Architecture** - Scalable project structure
- **Responsive Design** - Mobile-first approach
- **Modern UI Components** - Built with Radix UI primitives

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Authentication:** JWT with HTTP-only cookies
- **Icons:** Lucide React
- **Animations:** Framer Motion

## Getting Started

1. **Clone the repository:**
   \`\`\`bash
   git clone <repository-url>
   cd nextjs-boilerplate
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Update the environment variables in `.env.local`

4. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── providers/        # Context providers
├── features/             # Feature-based modules
│   ├── auth/            # Authentication feature
│   ├── dashboard/       # Dashboard feature
│   ├── users/           # User management feature
│   └── settings/        # Settings feature
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── types/               # TypeScript type definitions
├── schemas/            # Zod validation schemas (make separate files)
└── constants/           # Application constants
\`\`\`

## Authentication

The boilerplate includes a complete authentication system:

- **Login/Register** pages
- **JWT tokens** stored in HTTP-only cookies
- **Protected routes** with middleware
- **Role-based access** control
- **Automatic redirects** for authenticated users

### Demo Credentials

- **Admin:** admin@example.com / password123
- **User:** user@example.com / password123

## Features

### Dashboard
- Overview with statistics
- User management with data table
- Settings page with preferences
- Responsive navigation

### UI Components
- Modern design with shadcn/ui
- Dark/light mode support
- Accessible components
- Consistent styling

### Development
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Feature-based architecture

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript compiler

## Environment Variables

\`\`\`env
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
\`\`\`

### To get the environment values you can get all the variables from that /config/env.ts

## Deployment

This boilerplate is ready for deployment on platforms like:

- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **Docker**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see the [LICENSE](LICENSE) file for details.
