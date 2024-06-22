import { StreamChat } from 'stream-chat';

export const GET = async (req, {params}) => {
    
    try {
        const serverClient = StreamChat.getInstance('mn3h6qnhxxpz', '3jmy6acxbdq3g8xzfq3x8pfqrpartv3muqx6ywg52umtm7ry56k95xqwt48fwzb2');
        const token = serverClient.createToken(params.id);
        //console.log("token: ", token);
        return new Response(JSON.stringify({ token, userId: params.id }), { status: 200 })
        //res.status(200).json({ token, userId: id }); // Return the token and userId in the response
    } catch (error) {
        console.error('Error generating token:', error);
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
} 
