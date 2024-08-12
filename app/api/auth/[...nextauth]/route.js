import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from '@models/user';
import { connectToDB } from '@utils/database';


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session }) {
      
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();
      session.user.chatwithid = "";
      session.user.chatwithname = "";
      session.user.chatwithimage = "";
      session.user.viewuserid = "";
      
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();
        
        const userExists = await User.findOne({ email: profile.email });
        
        if (!userExists) {

          const test = await User.create({
            email: profile.email,
            username: profile.name,
            image: profile.picture,
            number: " ",
            college: " ",
            bio: " "

          });
          console.log(test);
        }
        
        return true
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false
      }
    },
    async redirect({ url, baseUrl }) {
      // Redirect to a specific URL and force the page to reload from the server
      return baseUrl + '?newSession=true';  // Append a query parameter to ensure the page reloads
    }
  }
})

export { handler as GET, handler as POST }

