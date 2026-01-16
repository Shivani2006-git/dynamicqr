# QRPay Manager

A complete web application for generating and managing dynamic QR codes for Google Pay UPI payments. Create a static QR code once, and update the underlying payment URL anytime without reprinting.

![QRPay Manager](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwindcss)

## Features

- 🔄 **Dynamic QR Codes** - Update payment details without changing the QR code
- 💳 **Google Pay UPI Support** - Full support for UPI payment links
- 📊 **Analytics Dashboard** - Track scan counts and performance
- 🔐 **Secure Authentication** - User accounts with email verification
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode support
- ⚡ **Fast & Reliable** - Built on Next.js and Supabase

## How It Works

1. **Create QR Code** - Enter your UPI ID, merchant name, and optional amount
2. **Get Static QR** - Download the QR code (this never changes)
3. **Update Anytime** - Change your UPI details in the dashboard
4. **Instant Redirect** - Scans always go to your latest payment link

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **QR Generation**: qrcode.react
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

### 1. Clone and Install

```bash
cd qr-pay-manager
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** and copy:
   - Project URL
   - Anon/Public key
3. Go to **SQL Editor** and run the migration:

```sql
-- Copy and run the contents of supabase/migrations/001_create_tables.sql
```

### 3. Configure Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login & Register pages
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── pay/[id]/         # Redirect endpoint
│   └── page.tsx          # Landing page
├── components/
│   ├── qr/               # QR code components
│   └── ui/               # Reusable UI components
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── upi.ts            # UPI URL utilities
│   └── utils.ts          # Helper functions
└── types/
    └── database.ts       # TypeScript types
```

## API Endpoints

### Redirect Endpoint
- `GET /pay/[id]` - Redirects to the current UPI payment URL

### QR Management
- `GET /api/qr` - List all user's QR codes
- `POST /api/qr` - Create new QR code
- `PATCH /api/qr` - Update QR code
- `DELETE /api/qr?id=` - Delete QR code

### Analytics
- `GET /api/analytics` - Get aggregate analytics
- `GET /api/analytics?qr_id=` - Get analytics for specific QR

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Production Considerations

- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Enable email confirmation in Supabase Auth settings
- Set up a custom domain for better QR code URLs

## UPI URL Format

The app generates standard UPI payment URLs:

```
upi://pay?pa=UPI_ID&pn=MERCHANT_NAME&am=AMOUNT&tn=NOTE&cu=INR
```

Parameters:
- `pa` - Payee Address (UPI ID)
- `pn` - Payee Name
- `am` - Amount (optional)
- `tn` - Transaction Note (optional)
- `cu` - Currency (default: INR)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for personal or commercial projects.

---

Built with ❤️ using Next.js and Supabase
