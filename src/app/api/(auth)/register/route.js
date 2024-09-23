// src/app/api/register/route.js
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { firstName, lastName, email, password, phoneNumbers, dob, gender } =
    await req.json();

  await connectMongo();

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumbers,
    dob,
    gender,
  });

  try {
    await newUser.save();
    return new Response(
      JSON.stringify({ message: "User registered successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error registering user." }), {
      status: 400,
    });
  }
}
