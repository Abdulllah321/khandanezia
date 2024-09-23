import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // for generating JWT token

export async function POST(req) {
  const { loginMethod, email, password, secretKey } = await req.json();

  try {
    await connectMongo();

    let user;

    if (loginMethod === "email") {
      // Find user by email
      user = await User.findOne({ email });
      if (!user) {
        return new Response(JSON.stringify({ message: "User not found" }), {
          status: 400,
        });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return new Response(JSON.stringify({ message: "Invalid password" }), {
          status: 400,
        });
      }
    } else if (loginMethod === "secretKey") {
      // Find user by secret key
      user = await User.findOne({ secretKey });
      if (!user) {
        return new Response(JSON.stringify({ message: "Invalid secret key" }), {
          status: 400,
        });
      }
    }

    // Create JWT token without expiration (lifetime token)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    // Set cookie without expiration (lifetime cookie)
    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: { userId: user.id, roles: user.roles },
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Secure; SameSite=Strict`, // Cookie will last until manually cleared
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
