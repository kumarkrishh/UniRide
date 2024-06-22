"use client"

import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import { useSession } from 'next-auth/react';
import 'stream-chat-react/dist/css/index.css';


const ChatsPage = ({ otherUserId }) => {
    const [client, setClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const { data: session } = useSession();

    useEffect(() => {
        if (!session || !session.user || !session.user.id) {
            console.log("Session or user data is not available.");
            return;
        }

        const initChat = async () => {
            try {
                const response = await fetch(`/api/newchatuser/${session.user.id}/${session.user.chatwithid}/${session.user.chatwithname}/gettoken`);
                //await fetch(`/api/newchatuser/${session.user.chatwithid}/${session.user.chatwithid}/gettoken`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();

                console.log("Data received:", session.user.chatwithid); // Data should contain token and userId
                console.log("Token:", data.token); // Access the token
                console.log("UserID:", data.userId); // Access the user ID

                const chatClient = StreamChat.getInstance('mn3h6qnhxxpz');
                
                if (client) {
                    await client.disconnectUser();
                }

                
                
                
                
                await chatClient.connectUser({
                    id: data.userId,
                    name: session?.user.name,
                    image: `https://getstream.io/random_png/?name=bob`
                }, data.token);
                
                

                const uniqueChannelId = [data.userId, session.user.chatwithid].sort().join('_');
                const newChannel = chatClient.channel('messaging', uniqueChannelId, {
                    members: [data.userId, session.user.chatwithid]
                });

                await newChannel.watch();
                setClient(chatClient);
                setChannel(newChannel);
            } catch (error) {
                console.error("Error initializing chat:", error);
            }
        };

        initChat();

        return async () => {
            if (client) {
                await client.disconnectUser();
                console.log("User disconnected successfully");
            }
        };
    }, [session, otherUserId]);

    if (!client) return <div>Setting up client & connection...</div>;

    return (
      <div className='str-chat'>
        <Chat client={client}>
            <Channel channel={channel}>
                <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput />
                </Window>
                <Thread />
            </Channel>
        </Chat>
      </div>
        
    );
};

export default ChatsPage;
