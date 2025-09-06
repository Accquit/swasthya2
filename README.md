# Swasthya AI Connect

A comprehensive healthcare web application featuring AI-powered symptom checking, mental wellness support, and telemedicine services.

## 🚀 Features

- **AI Symptom Checker**: Powered by Google's Gemini AI for intelligent symptom analysis
- **Mental Wellness Support**: AI-driven mental health guidance and mood tracking
- **Interactive Chat**: Real-time conversation with AI health assistant
- **Health Reports**: Comprehensive health report management
- **Pharmacy Locator**: Find nearby pharmacies and medical services
- **Video Consultation**: Connect with healthcare professionals
- **User Authentication**: Secure login and user management

## 🤖 AI Integration

This application uses **Google Gemini AI** to provide:
- Intelligent symptom analysis and health recommendations
- Conversational AI chat for health queries
- Mental wellness support and guidance
- Personalized health insights

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm
- Google Gemini API key

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>
cd swasthya-ai-connect-main

# Step 2: Install dependencies
npm install

# Step 3: Set up environment variables
cp .env.example .env

# Step 4: Add your Gemini API key to .env
# Edit .env file and add:
# VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Step 5: Start the development server
npm run dev
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click on "Get API Key" 
4. Create a new API key or use an existing one
5. Copy the API key and add it to your `.env` file

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Required for AI functionality
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional - Supabase configuration (if using backend)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Never commit your `.env` file to version control. The `.env.example` file shows the required structure.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── Header.tsx      # Main navigation
│   ├── Hero.tsx        # Landing page hero
│   └── SymptomChat.tsx # AI chat component
├── pages/              # Main application pages
│   ├── Index.tsx       # Home page
│   ├── SymptomChecker.tsx
│   ├── MentalWellness.tsx
│   ├── HealthReports.tsx
│   ├── PharmacyLocator.tsx
│   ├── VideoConsultation.tsx
│   └── Login.tsx
├── lib/                # Utility functions
│   ├── utils.ts        # General utilities
│   └── geminiService.ts # AI service integration
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
    └── supabase/       # Supabase configuration
```

## 🧠 AI Features

### Symptom Checker
- **Guided Form**: Structured symptom input with detailed analysis
- **AI Chat**: Conversational symptom assessment
- **Smart Analysis**: Contextual health recommendations
- **Urgency Assessment**: Priority-based healthcare guidance

### Mental Wellness
- **Mood Tracking**: Daily mood monitoring with AI insights
- **Wellness Chat**: Supportive AI conversations
- **Resource Recommendations**: Personalized mental health resources
- **Crisis Support**: Emergency mental health resources

## 🎨 Technologies Used

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **AI Integration**: Google Gemini AI
- **State Management**: React Query + Context API
- **Backend**: Supabase (optional)
- **Authentication**: Supabase Auth (optional)

## 🚀 Deployment

### Lovable Platform
1. Open [Lovable Project](https://lovable.dev/projects/a1d09e45-7e48-4f92-bc95-fe819a873828)
2. Click Share → Publish
3. Add your environment variables in the deployment settings

### Manual Deployment
```sh
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding Features

1. **New AI Capabilities**: Extend `geminiService.ts` with new functions
2. **UI Components**: Add components to `/components` directory
3. **Pages**: Create new pages in `/pages` directory
4. **Styling**: Use Tailwind classes and Shadcn components

## 📊 AI Service Architecture

The AI integration is centralized in `src/lib/geminiService.ts`:

- **`generateChatResponse()`**: Handles conversational AI interactions
- **`analyzeSymptoms()`**: Processes symptom data for health analysis  
- **`generateWellnessResponse()`**: Provides mental wellness support

All functions include error handling, fallback responses, and proper API key validation.

## 🔒 Security Considerations

- API keys are stored in environment variables
- Client-side validation for all user inputs
- Secure error handling without exposing sensitive data
- Medical disclaimers for AI-generated content

## 🎯 Custom Domain

To connect a custom domain:
1. Navigate to Project > Settings > Domains in Lovable
2. Click "Connect Domain"
3. Follow the setup instructions

Read more: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly 
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the [Lovable documentation](https://docs.lovable.dev)

---

**Note**: This application provides general health information and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.

## Project info

**URL**: https://lovable.dev/projects/a1d09e45-7e48-4f92-bc95-fe819a873828

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a1d09e45-7e48-4f92-bc95-fe819a873828) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a1d09e45-7e48-4f92-bc95-fe819a873828) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
