import User from '@models/user';
import { connectToDB } from '@utils/database';

export const GET = async (request, { params }) => {
    console.log("Fetching user data for ID:", params.id);
    try {
        await connectToDB();

        // Find user by id
        const user = await User.findById(params.id);
        
        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error("Failed to fetch user:", error);
        return new Response("Failed to fetch user data", { status: 500 });
    }
};

export const PUT = async (request, { params }) => {
    try {
      await connectToDB();
  
      const { username, email, number, college, image, bio } = await request.json();
  
      const updatedUser = await User.findByIdAndUpdate(params.id, {
        username,
        email,
        number,
        college,
        image,
        bio
      }, { new: true });
  
      if (!updatedUser) {
        return new Response("User not found", { status: 404 });
      }
      console.log(updatedUser);
  
      return new Response(JSON.stringify(updatedUser), { status: 200 });
    } catch (error) {
      console.error("Failed to update user:", error);
      return new Response("Failed to update user", { status: 500 });
    }
  };