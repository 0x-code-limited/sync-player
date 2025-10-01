import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUsersCollection } from "./mongodb";
import { CreateUserData } from "@/types/user";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", // Force JWT tokens instead of database sessions
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google" && user.email) {
          const usersCollection = await getUsersCollection();

          // Check if user already exists
          const existingUser = await usersCollection.findOne({
            $or: [{ id: user.id }, { email: user.email }],
          });

          if (!existingUser) {
            // Create new user in MongoDB
            const userData: CreateUserData = {
              id: user.id,
              email: user.email,
              name: user.name || "",
              image: user.image,
              provider: account.provider,
              providerId: account.providerAccountId || user.id,
            };

            const newUser = {
              ...userData,
              createdAt: new Date(),
              updatedAt: new Date(),
              lastLoginAt: new Date(),
            };

            await usersCollection.insertOne(newUser);
            console.log("New user created in MongoDB:", user.email);
          } else {
            // Update last login time
            await usersCollection.updateOne(
              { _id: existingUser._id },
              {
                $set: {
                  lastLoginAt: new Date(),
                  updatedAt: new Date(),
                },
              }
            );
            console.log("User login updated in MongoDB:", user.email);
          }
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return true; // Allow sign in even if database operation fails
      }
    },
    async session({ session, token }) {
      try {
        if (session.user?.email) {
          const usersCollection = await getUsersCollection();
          const dbUser = await usersCollection.findOne({
            $or: [{ id: session.user.id }, { email: session.user.email }],
          });

          if (dbUser) {
            session.user.mongoId = dbUser._id.toString();
            session.user.id = dbUser.id;
            session.user.email = dbUser.email;
            session.user.name = dbUser.name;
            session.user.image = dbUser.image;
          }
        }

        // Add JWT token to session for debugging
        session.accessToken = JSON.stringify(token);
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
    async jwt({ token, user, account }) {
      try {
        // If this is a new sign in, get the MongoDB user ID
        if (user?.email && account?.provider === "google") {
          const usersCollection = await getUsersCollection();
          const dbUser = await usersCollection.findOne({
            $or: [{ id: user.id }, { email: user.email }],
          });

          if (dbUser) {
            token.mongoId = dbUser._id.toString();
          }
        }

        return token;
      } catch (error) {
        console.error("Error in JWT callback:", error);
        return token;
      }
    },
  },
};
