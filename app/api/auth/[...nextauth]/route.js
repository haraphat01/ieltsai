import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      await connectDB();
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        session.user.id = user._id.toString();
        session.user.progress = user.progress;
      }
      return session;
    },
    async signIn({ user }) {
      try {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            progress: {
              academic: {
                reading: [],
                writing: [],
                listening: [],
                speaking: [],
              },
              general: {
                reading: [],
                writing: [],
                listening: [],
                speaking: [],
              },
            },
          });
        }
        return true;
      } catch (error) {
        console.error('Error checking if user exists:', error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };