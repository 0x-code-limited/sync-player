# Sync Player - Client

A Next.js application for synchronized video watching with friends and family. Features real-time synchronization, live chat, and private rooms.

## 🚀 Live Demo

**Production:** [https://sync-player-client-new.vercel.app](https://sync-player-client-new.vercel.app)

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure login with NextAuth.js
- 🎬 **Synchronized Video Playback** - Watch together in real-time
- 💬 **Live Chat** - Chat while watching
- 🔒 **Private Rooms** - Create secure viewing sessions
- 🌙 **Dark/Light Mode** - Theme toggle support
- 📱 **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3.4
- **Authentication:** NextAuth.js with Google OAuth
- **Styling:** Tailwind CSS 4.0
- **Language:** TypeScript
- **Deployment:** Vercel

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Google Cloud Console account (for OAuth)

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 🔑 Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** and **Google OAuth2 API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set **Application type** to **Web application**
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`

## 🚀 Getting Started

### Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sync-player/client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

#### Vercel Deployment

1. **Deploy to Vercel**

   ```bash
   npm run build
   vercel --prod
   ```

2. **Set environment variables in Vercel**

   - Go to your Vercel dashboard
   - Select your project → Settings → Environment Variables
   - Add all environment variables from `.env.local`
   - **Important:** Set `NEXTAUTH_URL` to your production URL

3. **Update Google OAuth settings**
   - Add your production domain to authorized redirect URIs
   - Format: `https://your-domain.com/api/auth/callback/google`

## 🔧 Adding New Deployment URLs

When deploying to a new domain or subdomain, follow these steps:

### 1. Update Environment Variables

Update your environment variables for the new deployment:

```env
# For new production deployment
NEXTAUTH_URL=https://your-new-domain.com
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. Configure Google OAuth

1. **Go to Google Cloud Console**

   - Navigate to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project

2. **Update OAuth 2.0 Client**
   - Go to **APIs & Services** → **Credentials**
   - Click on your OAuth 2.0 Client ID
   - In **Authorized redirect URIs**, add:
     ```
     https://your-new-domain.com/api/auth/callback/google
     ```
   - Click **Save**

### 3. Update Deployment Platform

#### For Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `NEXTAUTH_URL` to your new domain
5. Redeploy the application

#### For other platforms:

1. Set the environment variables in your hosting platform
2. Ensure `NEXTAUTH_URL` matches your deployment URL
3. Redeploy the application

### 4. Test Authentication

1. Visit your new deployment URL
2. Click **Sign In**
3. Test the Google OAuth flow
4. Verify successful authentication and redirect

## 🔍 Troubleshooting Authentication

### Common Issues:

1. **"Error 400: redirect_uri_mismatch"**

   - Ensure the redirect URI in Google Console matches exactly: `https://your-domain.com/api/auth/callback/google`
   - Check for trailing slashes and protocol (http vs https)

2. **"NEXTAUTH_URL environment variable not set"**

   - Set `NEXTAUTH_URL` in your environment variables
   - For production, use your full domain: `https://your-domain.com`

3. **"Invalid client: no registered origin"**

   - Add your domain to **Authorized JavaScript origins** in Google Console
   - Format: `https://your-domain.com` (no trailing slash)

4. **Authentication works locally but not in production**
   - Verify all environment variables are set in production
   - Check that `NEXTAUTH_SECRET` is set and secure
   - Ensure Google OAuth is configured for production domain

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/    # NextAuth API routes
│   ├── auth/signin/               # Custom sign-in page
│   ├── layout.tsx                 # Root layout with providers
│   └── page.tsx                   # Home page
├── components/
│   ├── AuthButton.tsx             # Authentication button
│   ├── SessionProvider.tsx        # NextAuth session provider
│   └── ui/                        # UI components
├── hooks/
│   └── useAuth.ts                 # Authentication hook
├── lib/
│   └── auth.ts                    # NextAuth configuration
└── sections/
    └── home/                      # Home page sections
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test authentication flow
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Live Demo:** [https://sync-player-client-new.vercel.app](https://sync-player-client-new.vercel.app)
- **NextAuth.js Documentation:** [https://next-auth.js.org/](https://next-auth.js.org/)
- **Google OAuth Setup:** [https://developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2)

---

**Note:** Make sure to keep your environment variables secure and never commit them to version control. Always use `.env.local` for local development and set them through your hosting platform's dashboard for production deployments.
