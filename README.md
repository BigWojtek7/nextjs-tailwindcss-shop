# E-Shop

E-Shop is a modern e-commerce application built with **Next.js**, utilizing **TypeScript**, **Tailwind CSS**, and **NextAuth** for user authentication. The application uses **PostgreSQL** as its database, and data management is handled through **Prisma**.

## Features

- **User Registration and Login**: Secure authentication using NextAuth.
- **User Profile Management**: Edit personal information and change avatar.
- **Product Browsing**: Display products with filtering and pagination options.
- **Shopping Cart**: Add, remove, and update product quantities in the cart.
- **Order Placement**: Order processing integrated with the database.
- **Order History**: View the history of placed orders.
- **Responsive User Interface**: Optimized for both mobile and desktop devices.

## Technologies

The project leverages the following technologies:

- **Next.js**: A React framework for building server-rendered applications.
- **TypeScript**: Static typing for enhanced code safety and readability.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI styling.
- **NextAuth**: A library for user authentication.
- **Prisma**: An ORM for managing the PostgreSQL database.
- **PostgreSQL**: A relational database system.
- **React**: A JavaScript library for building user interfaces.
- **DaisyUI**: A UI component library.
- **Shadcn UI & Radix UI**: UI component libraries providing low-level components.

## Installation

### System Requirements

- **Node.js**: Version 18 or higher
- **PostgreSQL**: Version 12 or higher
- **npm** or **yarn**: Package managers

### Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/e-shop.git
   cd e-shop
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory of the project and add the following variables:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/e-shop
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key
   AUTH_SECRET=your_nextauth_secret_key
   ```

   - **DATABASE_URL**: Connection string for your PostgreSQL database.
   - **NEXTAUTH_URL**: URL of your Next.js application (e.g., `http://localhost:3000`).
   - **NEXTAUTH_SECRET**: Secret key for encrypting sessions in NextAuth.
   - **AUTH_SECRET**: Secret key for additional authorization features.

4. **Database Migration**

   To create the necessary tables in your database, run the migration using Prisma:

   ```bash
   npx prisma migrate dev --name init
   ```

   This command will:

   - Create a new migration named `init`.
   - Update the database schema based on `prisma/schema.prisma`.
   - Generate the Prisma client for interacting with the database.

5. **Run the Application Locally**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
e-shop/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── register/
│   │   ├── orders/
│   │   ├── user/
│   │   │   └── upload-avatar/
│   │   └── ...
│   ├── auth/
│   │   ├── signin/
│   │   └── signup/
│   ├── cart/
│   ├── lib/
│   │   ├── authOptions.ts
│   │   ├── data.ts
│   │   ├── prisma.ts
│   │   └── ...
│   ├── profile/
│   ├── settings/
│   ├── ui/
│   │   ├── avatar/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── product-card/
│   │   └── ...
│   ├── context/
│   │   └── CartContext.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── ...
├── prisma/
│   └── schema.prisma
├── public/
│   └── default-avatar.png
├── styles/
│   └── globals.css
├── middleware.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Configuring Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/e-shop
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
AUTH_SECRET=your_nextauth_secret_key
```

- **DATABASE_URL**: Connection string to your PostgreSQL database.
- **NEXTAUTH_URL**: URL of your Next.js application (e.g., `http://localhost:3000`).
- **NEXTAUTH_SECRET**: Secret key for encrypting sessions in NextAuth.
- **AUTH_SECRET**: Secret key for additional authorization features.

## Database Migration

The project uses **Prisma** for managing database migrations. To apply the migration, use the following command:

```bash
npx prisma migrate dev --name init
```

This command will:

- Create a new migration named `init`.
- Update the database schema based on `prisma/schema.prisma`.
- Generate the Prisma client for interacting with the database.

## License

This project is licensed under the **MIT** License. See the [LICENSE](LICENSE) file for more details.
