import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { RegisteredUser } from "./user.interface";

const storeUserIntoDB = async (payload: RegisteredUser) => {
  const { name, email, password, profilePhoto } = payload;

  const isExists = await prisma.user.findUnique({
    where: { email },
  });

  if (isExists) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_secrect),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  await prisma.profile.create({
    data: {
      userId: createdUser.id,
      profilePhoto,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

const getMyProfileFromDB = async (userId: string) => {
  const profile = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return profile;
};

export const userServices = {
  storeUserIntoDB,
  getMyProfileFromDB,
};
