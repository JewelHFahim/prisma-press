import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma";
import config from "./config";

const port = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the Database Successfully!");
    app.listen(port, () => {
      console.log("Server running on port:", port);
    });
  } catch (error) {
    console.log("Server error, try again later", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
