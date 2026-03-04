# Bolna UI - Financial Customer Management Dashboard

A modern, comprehensive financial customer management system built with Next.js 16, featuring real-time transaction monitoring, risk assessment, AI-powered customer interactions, and detailed analytics.

## ✨ Features

### 📊 Dashboard

- **Transaction Trends**: Visual analytics of monthly credit/debit volumes
- **Category Breakdown**: Spending analysis across different categories
- **Payment Instruments**: Transaction distribution by payment methods
- **Real-time Statistics**: Total transactions, credits, debits, and net flow

### 👥 Customer Management

- **Customer List**: Sortable, filterable table with pagination
- **Risk Assessment**: Automated risk scoring (LOW, MEDIUM, HIGH, CRITICAL)
- **KYC Status Tracking**: Monitor verification status
- **Profile Details**: Comprehensive customer information

### 💰 Financial Analysis

- **Transaction History**: Detailed transaction logs with advanced filtering
- **Financial Summary**: Credit/debit analysis with monthly breakdowns
- **Category Analytics**: Spending patterns visualization
- **Product Management**: Track customer products and accounts

### 🤖 AI Features

- **AI Call Triggers**: Initiate automated customer calls
- **Call History**: Complete call logs with recordings
- **Call Analytics**: Duration, status, and outcome tracking
- **Audio Playback**: Listen to call recordings in-app

### 📈 Risk Management

- **Risk Score Calculation**: Automated risk assessment
- **Risk Details Dialog**: Detailed risk breakdown
- **Recalculation**: Manual risk score updates
- **Risk Level Indicators**: Visual risk status badges

### 📚 Knowledge Base

- **Auto-generation**: Generate KB from customer data
- **Preview System**: Review KB before finalization
- **Markdown Export**: Export customer information

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.6 (React 19.2.3)
- **State Management**: Zustand
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Tables**: TanStack Table
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bolna-ui
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your API endpoint:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Add other environment-specific configs
# NODE_ENV=development
```

### API Endpoints

The application connects to a backend API with the following endpoints:

- `/customers` - Customer list and management
- `/customers/:id` - Individual customer details
- `/products/:customerId` - Customer products
- `/transactions/:customerId` - Transaction history
- `/calls/:customerId` - Call history
- `/risk/:customerId` - Risk assessment data
- `/dashboard/transaction-trends` - Dashboard analytics
- `/knowledgebase/*` - KB generation and preview

## 📁 Project Structure

```
bolna-ui/
├── app/
│   ├── page.jsx                    # Dashboard page
│   ├── layout.jsx                  # Root layout
│   ├── globals.css                 # Global styles
│   └── customers/
│       ├── page.jsx                # Customers list page
│       └── [customerId]/
│           └── page.jsx            # Customer details page
├── components/
│   ├── dashboard/
│   │   └── transaction-trends.jsx  # Dashboard charts
│   ├── customers/
│   │   ├── customer-header.jsx     # Header with actions
│   │   ├── customer-filters.jsx    # Filters component
│   │   ├── kb-preview-dialog.jsx   # KB preview modal
│   │   └── table-columns.jsx       # Table column definitions
│   ├── customer-details/
│   │   ├── dashboard-tab.jsx       # Customer dashboard
│   │   ├── transactions-tab.jsx    # Transactions view
│   │   ├── products-tab.jsx        # Products view
│   │   ├── calls-tab.jsx           # Calls history
│   │   ├── financial-summary-charts.jsx
│   │   ├── risk-details-dialog.jsx
│   │   ├── detail-modals.jsx       # Transaction/Call modals
│   │   ├── stat-card.jsx           # Stat card component
│   │   └── table-columns.jsx       # Column definitions
│   ├── navigation/
│   │   └── app-bar.jsx             # Top navigation bar
│   ├── ui/                         # shadcn/ui components
│   ├── data-table.jsx              # Reusable data table
│   └── logo.jsx                    # Logo component
├── lib/
│   ├── api.js                      # Axios instance
│   ├── utils.js                    # Utility functions
│   └── stores/
│       └── customerStore.js        # Zustand store
└── public/                         # Static assets
```

## 🎨 Features in Detail

### Customer Details Page

- **Tabs Navigation**: Dashboard, Transactions, Products, Calls
- **Real-time Updates**: Refresh button for latest data
- **Interactive Tables**: Sorting, filtering, pagination
- **Detail Modals**: Click rows to view full details
- **Audio Player**: Play call recordings with auto-stop on close

### Transaction Filtering

- **Date Range**: Calendar-based date selection
- **Categories**: Filter by transaction category
- **Payment Methods**: Filter by instrument type
- **Transaction Types**: Credit/Debit filtering
- **Product Filter**: Filter by specific product

### Dashboard Analytics

- **Monthly Trends**: 12-month rolling view
- **Category Breakdown**: Top spending categories
- **Instrument Analysis**: Payment method distribution
- **Transaction Counts**: Volume tracking over time

## 🔐 Development

### Adding New Components

1. Create component in appropriate directory
2. Follow existing patterns for state management
3. Use shadcn/ui components for consistency
4. Update store if new API endpoints are needed

### Code Style

- Use functional components with hooks
- Leverage Zustand for global state
- Follow shadcn/ui patterns for UI components
- Use Tailwind CSS for styling
- Maintain TypeScript-like JSDoc comments

## 🏗️ Building for Production

```bash
npm run build
npm run start
```

## 🐳 Docker Support

Build and run with Docker:

```bash
docker build -t bolna-ui .
docker run -p 3000:3000 bolna-ui
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Zustand](https://github.com/pmndrs/zustand)

---

Made with ❤️ for financial customer management
