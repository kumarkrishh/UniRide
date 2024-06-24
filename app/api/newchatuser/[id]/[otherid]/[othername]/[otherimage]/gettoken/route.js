import { StreamChat } from 'stream-chat';

export const GET = async (req, {params}) => {
    
    try {
        const serverClient = StreamChat.getInstance(process.env.GETSTREAM_API_KEY, process.env.GETSTREAM_API_SECRET);
        const token = serverClient.createToken(params.id);
        await serverClient.upsertUser({
            id: params.otherid,
            name: params.othername,
            image: params.otherimage
        });
       
        return new Response(JSON.stringify({ token, userId: params.id }), { status: 200 })
       
    } catch (error) {
        console.error('Error generating token:', error);
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
} 
