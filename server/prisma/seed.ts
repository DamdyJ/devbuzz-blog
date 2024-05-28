import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
import path from "path";

async function main() {
    try {
        // Create Tags
        const tags = [
            "html",
            "css",
            "javascript",
            "sql",
            "nosql",
            "frontend",
            "backend",
            "ui/ux",
        ];
        for (const tagName of tags) {
            await prisma.tag.create({
                data: { name: tagName },
            });
        }

        // Create Users
        const users = [
            {
                username: "john_doe",
                email: "john_doe@gmail.com",
                password: "123456",
            },
            {
                username: "jane_doe",
                email: "jane_doe@gmail.com",
                password: "123456",
            },
            { username: "alice", email: "alice@gmail.com", password: "123456" },
            { username: "bob", email: "bob@gmail.com", password: "123456" },
        ];

        const saltRounds = 10;
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const profileImage = path.join(
                __dirname,
                `../../../client/public/profile0${[i+1]}.png`
            );
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);

            await prisma.user.create({
                data: {
                    ...user,
                    password: hashedPassword,
                    profile: {
                        create: {
                            user_bio: `Hello, I am ${user.username}!`,

                            profile_image: profileImage,
                        },
                    },
                },
            });
        }
        // Fetch created users and tags
        const userList = await prisma.user.findMany();
        const tagList = await prisma.tag.findMany();

        // Generate 1000 characters of content
        const generateContent = (title: string) => {
            const content = `
      This is an in-depth article about ${title}. 
      ${"Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(30)}
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      `.trim();
            return content;
        };

        // Create Articles
        const articles = [
            {
                title: "Understanding HTML Basics",
                thumbnail: path.join(
                    __dirname,
                    "../../../client/public/thumbnail/image (1).jpg"
                ),
                tag: "html",
            },
            {
                title: "CSS for Beginners",
                thumbnail: path.join(
                    __dirname,
                    "../../../client/public/thumbnail/image (2).jpg"
                ),
                tag: "css",
            },
            {
                title: "JavaScript ES6 Features",
                thumbnail: path.join(
                    __dirname,
                    "../../../client/public/thumbnail/image (3).jpg"
                ),
                tag: "javascript",
            },
            {
                title: "Introduction to SQL",
                thumbnail: path.join(
                    __dirname,
                    "../../../client/public/thumbnail/image (4).jpg"
                ),
                tag: "sql",
            },
            {
                title: "NoSQL Databases Overview",
                thumbnail: path.join(
                    __dirname,
                    "../../../client/public/thumbnail/image (5).jpg"
                ),
                tag: "nosql",
            },
            {
                title: "Frontend Development Guide",
                thumbnail: path.join(
                    __dirname,
                    "../../../client/public/thumbnail/image (6).jpg"
                ),
                tag: "frontend",
            },
            {
                title: "Backend Development Tips",
                thumbnail: path.join(
                    __dirname,
                    "../../../client/public/thumbnail/image (7).jpg"
                ),
                tag: "backend",
            },
            {
                title: "Full-Stack Development",
                thumbnail: path.join(
                    __dirname,
                    "../../../client/public/thumbnail/image (8).jpg"
                ),
                tag: "frontend",
            },
        ];

        for (const [index, articleData] of articles.entries()) {
            await prisma.article.create({
                data: {
                    user_id: userList[index % userList.length].id,
                    title: articleData.title,
                    tag_id:
                        tagList.find((tag) => tag.name === articleData.tag)
                            ?.id || tagList[0].id,
                    thumbnail: articleData.thumbnail,
                    content: generateContent(articleData.title),
                },
            });
        }
        // Create Comments
        const comments = [
            "Great article!",
            "Very helpful information.",
            "Thanks for sharing!",
            "I learned a lot from this.",
            "This cleared up a lot of confusion for me.",
        ];

        const createRandomComment = () => {
            const randomIndex = Math.floor(Math.random() * comments.length);
            return comments[randomIndex];
        };

        for (const article of articles) {
            const articleTitle = article.title;
            const foundArticle = await prisma.article.findFirst({
                where: { title: articleTitle },
            });
            if (foundArticle) {
                for (let i = 0; i < 5; i++) {
                    const randomComment = createRandomComment();
                    await prisma.comment.create({
                        data: {
                            user_id: userList[i % userList.length].id,
                            article_id: foundArticle.id,
                            comment: randomComment,
                        },
                    });
                }
            }
        }
    } catch (error: any) {
        throw new Error(error);
    } finally {
        await prisma.$disconnect();
    }
}
main();
