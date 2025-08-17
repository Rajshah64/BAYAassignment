# Cosmic Event Tracker

A web application for tracking Near-Earth Objects (NEOs) and cosmic events using NASA's Open APIs. Built with Next.js, TypeScript, and modern web technologies.

## Features

### Core Functionality

- Real-time NEO data from NASA's Near Earth Object Web Service (NeoWs)
- Event listing with pagination and load more functionality
- Detailed event information with orbital data
- Advanced filtering and sorting options
- Responsive design for mobile and desktop

### Authentication

- User registration and login with Supabase
- Protected routes and user state management
- Session persistence and secure authentication

### Data Management

- Automatic data fetching with NASA API integration
- Date range filtering with custom date picker
- Hazardous asteroid filtering
- Multiple sorting options (date, size, distance)
- Real-time data updates

## Technology Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with ShadCN UI components
- **State Management**: React Hooks and Context API
- **Icons**: Lucide React

### Backend & APIs

- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **External API**: NASA NEO Web Service
- **HTTP Client**: Axios

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Type Checking**: TypeScript

## Project Structure

```
cosmic-event-tracker/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── events/            # Event detail pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── events/            # Event-related components
│   │   ├── layout/            # Layout components
│   │   ├── shared/            # Shared utility components
│   │   └── ui/                # ShadCN UI components
│   ├── lib/                   # Utility libraries
│   │   ├── api/               # API client configurations
│   │   ├── db/                # Database utilities
│   │   ├── hooks/             # Custom React hooks
│   │   ├── supabase/          # Supabase client configurations
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   └── prisma/                # Database schema and migrations
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation
```

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database
- Supabase account
- NASA API key

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cosmic-event-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env.local` file with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database"
   DIRECT_URL="postgresql://user:password@host:port/database"

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

   # NASA API
   NEXT_PUBLIC_NASA_API_KEY="your_nasa_api_key"
   ```

4. **Database Setup**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Integration

### NASA NEO Web Service

The application integrates with NASA's Near Earth Object Web Service API:

- **Endpoint**: `https://api.nasa.gov/neo/rest/v1/feed`
- **Parameters**:
  - `start_date` (YYYY-MM-DD): Required start date
  - `end_date` (YYYY-MM-DD): Required end date
  - `api_key`: NASA API key
- **Limitations**: Maximum 7-day date range per request
- **Rate Limits**: Subject to NASA API rate limiting

### Data Structure

NEO objects contain:

- Basic information (name, ID, magnitude)
- Hazard assessment (potentially hazardous status)
- Estimated diameter ranges
- Close approach data (date, distance, velocity)
- Orbital information (when available)

## Component Architecture

### Core Components

- **EventList**: Displays paginated list of NEO events
- **EventCard**: Individual event display with key information
- **EventDetail**: Comprehensive event information view
- **EventFilters**: Filtering and sorting controls
- **DateRangePicker**: Custom date range selection

### Authentication Components

- **AuthProvider**: Context provider for authentication state
- **AuthGuard**: Route protection wrapper
- **AuthForm**: Login and registration forms

### Layout Components

- **Header**: Navigation and user authentication status
- **Footer**: Application information and external links
- **LoadingSpinner**: Loading state indicators

## State Management

### Authentication State

- User session management
- Login/logout functionality
- Protected route handling
- Session persistence

### Data State

- NEO data caching
- Filter state management
- Pagination state
- Loading and error states

### Filter State

- Date range selection
- Hazardous object filtering
- Sorting preferences
- Search criteria

## Database Schema

### User Model

```sql
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  name          String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  favorites     Favorite[]
  searchHistory SearchHistory[]
}
```

### Favorite Model

```sql
model Favorite {
  id                String   @id @default(uuid())
  userId            String
  neoId             String
  neoName           String
  approachDate      DateTime
  isHazardous       Boolean
  estimatedDiameter Float
  createdAt         DateTime @default(now())
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, neoId])
  @@index([userId])
}
```

### SearchHistory Model

```sql
model SearchHistory {
  id        String   @id @default(uuid())
  userId    String
  startDate DateTime
  endDate   DateTime
  filters   Json?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

## Custom Hooks

### useNEOData

Manages NEO data fetching, filtering, and pagination:

- Automatic data fetching on component mount
- Load more functionality with date range extension
- Filter application and sorting
- Error handling and loading states

### useAuth

Provides authentication context and methods:

- User state management
- Login/logout functions
- Session validation
- Protected route access

## Styling and UI

### Design System

- **Colors**: Consistent color palette with CSS variables
- **Typography**: Inter font family with responsive sizing
- **Spacing**: Tailwind CSS spacing scale
- **Components**: ShadCN UI component library

### Responsive Design

- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Adaptive navigation

## Performance Optimizations

### Code Splitting

- Dynamic imports for heavy components
- Route-based code splitting
- Lazy loading of non-critical features

### Data Management

- Efficient API calls with proper caching
- Optimized re-renders with React.memo
- Debounced filter updates
- Pagination to limit data load

### Bundle Optimization

- Tree shaking for unused code
- Optimized image loading
- Minimal bundle size with Next.js optimizations

## Error Handling

### API Errors

- Network error handling
- Rate limit detection
- Invalid API key handling
- Graceful fallbacks

### User Experience

- Loading states for all async operations
- Error boundaries for component failures
- User-friendly error messages
- Retry mechanisms for failed operations

## Security Features

### Authentication

- Secure session management
- Protected route access
- JWT token validation
- CSRF protection

### Data Validation

- Input sanitization
- Type checking with TypeScript
- API parameter validation
- SQL injection prevention

## Testing

### Component Testing

- Unit tests for utility functions
- Component rendering tests
- Hook behavior testing
- Integration tests for data flow

### API Testing

- NASA API integration tests
- Supabase authentication tests
- Error handling validation
- Performance testing

## Deployment

### Build Process

```bash
npm run build
npm start
```

### Environment Variables

- Production environment configuration
- API key management
- Database connection strings
- Feature flags

### Deployment Platforms

- Vercel (recommended)
- Netlify
- AWS Amplify
- Self-hosted options

## Contributing

### Development Setup

1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request

### Code Standards

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commit messages

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For technical support or questions:

- Create an issue in the repository
- Check the documentation
- Review the code examples
- Contact the development team

## Acknowledgments

- NASA for providing the NEO Web Service API
- Supabase for authentication services
- Next.js team for the framework
- ShadCN for the UI component library
- Open source community contributors
