"use client";

import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window, ChannelList } from 'stream-chat-react';
import { useSession } from 'next-auth/react';
import 'stream-chat-react/dist/css/index.css';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const ChatsPage = () => {
  const [client, setClient] = useState(null);
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session || !session.user || !session.user.id) {
      console.log("Session or user data is not available.");
      return;
    }

    const initChat = async () => {
      try {
        const chatwithimageEncoded = encodeURIComponent(session.user.chatwithimage);
        const response = await fetch(`/api/newchatuser/${session.user.id}/${session.user.chatwithid}/${session.user.chatwithname}/${chatwithimageEncoded}/gettoken`);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        const chatClient = StreamChat.getInstance('mn3h6qnhxxpz');

        /*if (client) {
          await client.disconnectUser();
        }*/

        await chatClient.connectUser({
          id: data.userId,
          name: session?.user.name,
          image: session.user.image
        }, data.token);

        const filter = { type: 'messaging', members: { $in: [data.userId] } };
        const sort = [{ last_message_at: -1 }];
        const userChannels = await chatClient.queryChannels(filter, sort, {
          watch: true, // this is the default
          state: true,
        });

        setClient(chatClient);
        setChannels(userChannels);

        // Create a new channel
        const uniqueChannelId = [data.userId, session.user.chatwithid].sort().join('_');
        const newChannel = chatClient.channel('messaging', uniqueChannelId, {
          members: [data.userId, session.user.chatwithid]
        });

        await newChannel.watch();
        setActiveChannel(newChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    initChat();

    return async () => {
      /*if (client) {
        await client.disconnectUser();
        console.log("User disconnected successfully");
      }*/
    };
  }, [session]);

  if (!client) {
    return (
      <Box sx={{
        backgroundColor: '#141d26',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
      }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
<div className="rounded-lg bg-black" style={{ height: "calc(100vh - 100px)", marginTop: '20px', overflow: 'hidden' }}>
    <div className='str-chat'>
      <Chat client={client} theme="messaging dark">
        <ChannelList
          filters={{ type: 'messaging', members: { $in: [session.user.id] } }}
          sort={{ last_message_at: -1 }}
          Preview={(previewProps) => (
            <div
              className={`channel-preview__container ${previewProps.channel?.id === activeChannel?.id ? 'selected' : ''}`}
              onClick={() => setActiveChannel(previewProps.channel)}
            >
              <div className="channel-preview__content-wrapper">
                <div className="channel-preview__content-top">
                  <p className="channel-preview__content-name">
                    {previewProps.channel?.state.members && Object.values(previewProps.channel.state.members)
                      .filter(member => member.user_id !== session.user.id)
                      .map(member => member.user.name)
                      .join(', ') || 'Unknown User'}
                  </p>
                  <p className="channel-preview__content-time">
                    {new Date(previewProps.channel?.state.last_message_at).toLocaleTimeString()}
                  </p>
                </div>
                <p className="channel-preview__content-message">
                  {previewProps.channel?.state.messages.length > 0 ? previewProps.channel?.state.messages[previewProps.channel?.state.messages.length - 1].text : 'No messages yet'}
                </p>
              </div>
            </div>
          )}
        />
        <div className="channel-messages">
          {activeChannel && (
            <Channel channel={activeChannel}>
              <Window>
                <ChannelHeader />
                <MessageList className="bg-black"/>
                <MessageInput  />
              </Window>
              <Thread />
            </Channel>
          )}
        </div>
      </Chat>
      <style jsx>{`
      
        .str-chat {
          display: flex;
        }
        .channel-list {
          width: 30%;  /* Updated to take up 40% of the screen */
          border-right: 2px solid #ddd;
          padding: 10px;
          overflow-y: auto;
          
        }
        .channel-messages {
          width: 70%;  /* Updated to take up the remaining 60% */
          display: flex;
          flex-direction: column;
          height: calc(100vh - 100px);

        }
        .channel-preview__container {
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 8px;
          cursor: pointer;
        }
        .channel-preview__container.selected {
          background-color: #b3b3b3;
        }
        .channel-preview__content-wrapper {
          display: flex;
          flex-direction: column;
        }
        .channel-preview__content-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .channel-preview__content-name {
          font-weight: bold;
        }
        .channel-preview__content-time {
          font-size: 0.75rem;
          color: #333;
        }
        .channel-preview__content-message {
          font-size: 0.875rem;
          color: #666;
        }
      `}</style>
    </div>
    </div>
  );
};

export default ChatsPage;
