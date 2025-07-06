# ChakrAI - Digital Security Assistant

ChakrAI is an intelligent assistant for digital security, specifically focused on detecting and warning about illegal gambling and loan activities in Indonesia. The application combines web scraping, AI analysis, and community reporting to provide real-time security insights.

## Features

- 🤖 **AI-Powered Analysis**: Uses Google Gemini AI to analyze locations for security risks
- 🌐 **Web Scraping**: Automatically scrapes news sources for illegal activities
- 📍 **Location-Based Warnings**: Provides specific warnings based on user location
- 💰 **Financial Literacy**: Offers tips to avoid financial scams
- 📊 **Data Management**: Comprehensive database for storing and analyzing security data
- 🔄 **Real-time Updates**: Continuous data collection and analysis

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini AI
- **Web Scraping**: Puppeteer + Express.js
- **State Management**: React Context API

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Google Gemini AI API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd judol-scanning
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Note down your project URL and anon key

2. **Set Up Database**:
   - Go to your Supabase dashboard → SQL Editor
   - Run the SQL script from `supabase_setup.sql`

3. **Configure Environment Variables**:
   - Copy `.env.example` to `.env` (or create `.env` if it doesn't exist)
   - Update the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# App Configuration
VITE_APP_NAME=ChakrAI
VITE_APP_URL=/
```

### 4. Set Up Google Gemini AI

1. **Get API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

2. **Update API Key**:
   - Open `src/services/geminiService.js`
   - Replace the API_KEY constant with your actual key

### 5. Start the Application

```bash
# Start the frontend development server
npm run dev

# Start the backend server (for web scraping)
npm run server
```

The application will be available at `http://localhost:5173`

## Database Schema

### scraped_data Table
- Stores web-scraped data from news sources
- Contains URL, title, description, category, location, etc.

### laporan_kasus Table
- Stores user-reported cases
- Contains location details and case information

## API Endpoints

### Backend Server (Port 3001)
- `POST /api/scrape` - Trigger web scraping
- `GET /proxy?url=<url>` - CORS proxy for web scraping

## Usage

1. **Landing Page**: Welcome screen with app introduction
2. **AI Chat**: Main interface for location-based security analysis
3. **Database Sidebar**: View and manage scraped data
4. **Reporting**: Report new cases or incidents

## Development

### Project Structure
```
src/
├── components/     # React components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── layout/         # Layout components
├── pages/          # Page components
├── services/       # API and service functions
└── lib/           # Library configurations
```

### Key Services
- `databaseService.js` - Supabase database operations
- `scrapingService.js` - Web scraping coordination
- `geminiService.js` - AI analysis
- `dataService.js` - Local data management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
