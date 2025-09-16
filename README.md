# CaseCobra - A Modern Fullstack E-Commerce Shop for Custom Phone Cases

Built with the Next.js 14 App Router, Postgres, TypeScript, Tailwind & Kinde Auth

![Project Image](https://github.com/joschan21/casecobra/blob/master/public/thumbnail.png)

## Features

- 🛠️ Complete shop built from scratch in Next.js 14
- 💻 Beautiful landing page included
- 🎨 Custom artworks made by a professional illustrator
- 💳 Secret admin dashboard to manage orders
- 🖥️ Drag-and-drop file uploads
- 🛍️ Customers can purchase directly from you
- 🌟 Clean, modern UI on top of shadcn-ui
- 🛒 Completely custom phone case configurator
- 🔑 Authentication using Kinde
- ✉️ Beautiful thank-you email after purchase
- ✅ Apple-inspired configuration design
- ⌨️ 100% written in TypeScript
- 🎁 ...much more

## Getting started

To get started with this project, run

```bash
  git clone https://github.com/joschan21/casecobra.git
```

and copy the .env.example variables into a separate .env file, fill them out & and that's all you need to get started!

## Acknowledgements

- Kinde for making this project possible
- UploadThing for handling file uploads
- Prisma for the database ORM
- Stripe for payment processing
- Resend for transactional emails

## .env.example

```dotenv
# Kinde Auth
KINDE_CLIENT_ID=''
KINDE_CLIENT_SECRET=''
KINDE_ISSUER_URL=''
KINDE_SITE_URL='http://localhost:3000'
KINDE_AUDIENCE=''
KINDE_POST_LOGOUT_REDIRECT_URL='http://localhost:3000'
KINDE_POST_LOGIN_REDIRECT_URL='http://localhost:3000/auth-callback'

# Prisma
DATABASE_URL=''

# UploadThing
UPLOADTHING_SECRET=''
UPLOADTHING_APP_ID=''

# Stripe
STRIPE_SECRET_KEY=''
STRIPE_WEBHOOK_SECRET=''

# Resend
RESEND_API_KEY=''
```

## License

MIT
