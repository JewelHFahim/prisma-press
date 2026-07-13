1. git init

2. create -.gitignore

3. install:
npm init
npm install typescript tsx @types/node --save-dev
npx tsc --init

4. instaoll:
npm install prisma @types/pg --save-dev
npm install @prisma/client @prisma/adapter-pg pg dotenv

5. setup tsconfig.json 
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",
    "types": ["node"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "strict": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  },
  // "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}

6. create db and connect set connetion string

7. creat folder and file src, server.ts, app.ts

8. install necessary packeges: 
express; bcryptjs; cors; cookie-parser; http-status; jsonwebtoken

9. setup intial app and server +  run & test

10. create lib folder and prisma.ts file, insert this

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

11. npx prisma generate

12. 
