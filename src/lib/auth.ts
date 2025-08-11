import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./db"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        try {
          console.log('NextAuth authorize called with:', credentials)
          console.log('Available env vars (filtered):', Object.keys(process.env).filter(key => 
            key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('SUPABASE')
          ).map(key => `${key}: ${process.env[key] ? 'SET' : 'NOT SET'}`))
          
          if (!credentials?.email) {
            console.log('No email provided')
            return null
          }

          // For development, create user if doesn't exist
          let user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          })

          console.log('Existing user found:', user)

          if (!user) {
            console.log('Creating new user')
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.name || "User",
                role: credentials.role === "PARENT" ? "PARENT" : "CHILD",
              },
            })
            console.log('New user created:', user)
          }

          const authUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
          
          console.log('Returning auth user:', authUser)
          return authUser
        } catch (error) {
          console.error('Error in authorize function:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
}