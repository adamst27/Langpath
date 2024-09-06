"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ActionResult } from "next/dist/server/app-render/types";
import bcrypt, { compare } from "bcrypt";
import { User } from "../db/schemas/User";
import { lucia, validateRequest } from "../utils/auth";
import { connectToDB } from "../db/db";
export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }
  const existingUser: User | null = await User.findOne({ email: email });
  if (!existingUser) {
    return {
      error: "Incorrect username or password",
    };
  }

  const validPassword = await compare(password, existingUser.password);

  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }
  const session = await lucia.createSession(
    existingUser._id,
    {
      name: existingUser.name,
      email: existingUser.email,
    },
    {
      sessionId: crypto.randomUUID(),
    }
  );

  const sessionCookie = lucia.createSessionCookie(session.id);
  console.log(sessionCookie);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/dashboard");
}

export async function logout(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  redirect("/");
}

export async function register(formData: FormData) {
  const { name, email, password } = Object.fromEntries(formData.entries());
  try {
    await connectToDB();
    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);

    const userDoc = new User({ name, email, password: hashedPassword });
    await userDoc.save();

    const user: User | null = await User.findOne({ name: name, email: email });
    if (!user) {
      throw new Error("User not found");
    }
    const session = await lucia.createSession(
      user._id as string,
      {
        name: user.name as string,
        email: user.email as string,
      },
      {
        sessionId: crypto.randomUUID(),
      }
    );
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    console.error(error);
  }
}
