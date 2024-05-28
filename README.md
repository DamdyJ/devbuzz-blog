# DevBuzz Blog

DevBuzz Blog is a full-stack blog website built with TypeScript, Express.js, JsonWebToken, Prisma, MySQL, XAMPP, inversify for the backend, and Next.js, Axios, and Zod for the frontend.

![devbuzz-homepage](https://github.com/DamdyJ/devbuzz-blog/assets/152348339/adfc4fe6-1a20-4ad0-b980-cf2ed91df5f2)
## Table of Content
- [Installation](#installation)
- [Usage](#usage)
- [Additional Information](#additional-information)
- [Technologies Used](#technologies-used)
- [Screenshot](#screenshot)
  - [Article](#article)
  - [Comment](#comment)
  - [Post](#post)
- [Contributors](#contributors)
- [License](#license)
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
12. Name the migration whatever you like, for example, **init**.
13. Fill the database data with dummy data: `npm run seed`.
14. Start the development server: `npm run dev`
15. Go to your browser and type the URL `http://localhost:3000`

## Usage

- **Authentication**: 
  - Register an account or log in if you already have one.
- **Profile Management**:
  - View your profile.
  - Share your profile.
- **Article Management**:
  - Infinite article viewer.
  - Search articles by title/tag.
  - Post articles.
  - Comment on articles.

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

## Screenshot
### Article
![article-section](https://github.com/DamdyJ/devbuzz-blog/assets/152348339/5497dab8-95b1-4daf-9da3-de70d7491b8e)

### Comment
![comment-section](https://github.com/DamdyJ/devbuzz-blog/assets/152348339/125173b7-05f6-42b3-9d80-6d485978c0c5)

### Post
![post-section](https://github.com/DamdyJ/devbuzz-blog/assets/152348339/9d04ee09-d112-499d-905a-bf86c7dbca5d)

## Contributors

- [DamdyJ](https://github.com/DamdyJ)

## License

This project is licensed under the [MIT License](LICENSE).
