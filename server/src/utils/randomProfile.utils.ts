import path from "path";

function getRandomNumber() {
    return Math.floor(Math.random() * 4) + 1;
}

export const defaultProfile = path.join(
    __dirname,
    `../../../client/public/data/profile0${getRandomNumber()}.png`
);
