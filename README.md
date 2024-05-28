# DevBuzz Blog

DevBuzz Blog is a full-stack blog website built with TypeScript, Express.js, JsonWebToken, Prisma, MySQL, XAMPP, inversify for the backend, and Next.js, Axios, and Zod for the frontend.

## Installation

To run the project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/DamdyJ/devbuzz-blog.git`
2. Navigate to the project directory: `cd devbuzz-blog`
3. Install XAMPP and run Apache & MySQL.
4. You need 2 terminals to run the project, one for the client and the other for the server.
5. Navigate to the client directory: `cd client`
6. Install dependencies: `npm install`
7. Start the development server: `npm run dev`
8. Use a different terminal to run the server.
9. Navigate to the server directory: `cd server`
10. Install dependencies: `npm install`
11. Then you need to create the database using Prisma: `npx prisma migrate dev`
12. Name the migration whatever you like, for example, 'init'.
13. Fill the database data with dummy data: `npm run seed`.
14. Start the development server: `npm run dev`
15. Go to your browser and type the URL `http://localhost:3000`

## Usage

- **Authentication**: 
  - Register an account or log in if you already have one.
- **Profile Management**:
  - View your profile.
  - Share your profile.
  - Update your profile bio.
- **Article Management**:
  - View articles.
  - Search articles by title.
  - Post articles.
  - Comment on articles.
  - Select categories/tags for articles.

## Additional Information

If you encounter any issues during installation or usage, please refer to the project's issue tracker on GitHub for assistance.

## Technologies Used

### Backend

- TypeScript: A typed superset of JavaScript that compiles to plain JavaScript.
- Express.js: A web application framework for Node.js.
- JsonWebToken (JWT): A compact, URL-safe means of representing claims to be transferred between two parties.
- Prisma: A modern database toolkit for TypeScript and Node.js.
- MySQL: An open-source relational database management system.
- XAMPP: A free and open-source cross-platform web server solution stack package.
- Inversify: A powerful and lightweight inversion of control container for TypeScript and JavaScript apps.

### Frontend

- Next.js: A React framework for building server-rendered applications.
- Axios: A promise-based HTTP client for the browser and Node.js.
- Zod: A TypeScript-first schema declaration and validation library.

## Contributors

- [DamdyJ](https://github.com/DamdyJ)

## License

This project is licensed under the [MIT License](LICENSE).
