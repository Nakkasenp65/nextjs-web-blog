# Next.js Web Blog

A full-stack blog application built with Next.js 14.

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Validation**: Zod
- **Animations**: Framer Motion and GSAP
- **Media Storage**: Cloudinary
- **Theme Management**: next-themes

## Features

- **Authentication**: Credentials-based signup and login.
- **Blog Management**: Create, read, update, and delete blog posts.
- **User Profiles**: Custom profiles with editable details and avatar uploads.
- **Interactions**: Like and comment system for blog posts.
- **Categories**: Organize posts into Tech, Entertainment, Sports, Health, and Animals.
- **UI/UX**:
  - Dark and Light mode support.
  - Document-style blog editor.
  - Responsive design.
  - Interactive parallax effects on the homepage.

## Getting Started

### Prerequisites

- Node.js 18.17 or later.
- MongoDB Atlas account or local MongoDB instance.
- Cloudinary account for image management.

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   - `MONGODB_URL`
   - `AUTH_SECRET`
   - `JWT_SECRET`
   - `CLOUD_NAME`
   - `CLOUD_API_KEY`
   - `CLOUD_API_SECRET`

### Development

Run the development server:

```bash
npm run dev
```

### Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```
