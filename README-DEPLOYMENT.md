# Dumpster Rental Site - Deployment Guide

## Overview
This is a Next.js static site migrated from PHP, optimized for Cloudflare Pages deployment.

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Cloudflare Pages Deployment

### Method 1: Direct from GitHub
1. Push this code to a GitHub repository
2. Go to Cloudflare Pages dashboard
3. Create new project → Connect to Git
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Build output directory: `out`
6. Deploy!

### Method 2: Direct Upload
```bash
# Build the site
npm run build

# The static files will be in the 'out' directory
# Upload the 'out' directory contents to Cloudflare Pages
```

### Method 3: Using Wrangler CLI
```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build and deploy
npm run build
wrangler pages deploy out --project-name=dumpster-rental
```

## Environment Variables (for contact form)

For the contact form to work with email notifications, add these to Cloudflare Pages:

- `EMAIL_API_KEY`: Your email service API key (SendGrid, Resend, etc.)
- `NOTIFICATION_EMAIL`: Where to send form submissions

## Features

- ✅ All static pages converted from PHP
- ✅ Dynamic routing for 50 states
- ✅ Dynamic routing for thousands of city pages
- ✅ Contact form ready (needs email service integration)
- ✅ SEO-friendly URLs maintained
- ✅ Mobile responsive
- ✅ Fast static site generation

## Site Structure

```
/                                   → Home
/dumpster-sizes/                   → Sizes page
/about/                            → About page
/by-state/                         → States listing
/contact/                          → Contact page
/[state]/                          → State page (e.g., /texas/)
/[state]/dumpster-rental-[city]/  → City page (e.g., /texas/dumpster-rental-houston/)
```

## Next Steps

1. **Email Integration**: Connect the contact form to an email service
2. **Analytics**: Add Google Analytics or Cloudflare Analytics
3. **City Data**: Optionally scrape all city data or generate on-demand
4. **Custom Domain**: Configure your domain in Cloudflare Pages settings

## Performance

This static site will load extremely fast on Cloudflare's edge network with:
- Global CDN distribution
- Automatic HTTPS
- HTTP/3 support
- Brotli compression
- Zero server costs