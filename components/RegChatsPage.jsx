"use client";

import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window, ChannelList } from 'stream-chat-react';
import { useSession } from 'next-auth/react';
import 'stream-chat-react/dist/css/index.css';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const RegChatsPage = ({ otherUserId }) => {
  const [client, setClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session || !session.user || !session.user.id) {
      console.log("Session or user data is not available.");
      return;
    }

    const initChat = async () => {
      try {
        const response = await fetch(`/api/newchatuser/${session.user.id}/gettoken`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        const chatClient = StreamChat.getInstance('mn3h6qnhxxpz');
        await chatClient.connectUser({
          id: data.userId,
          name: session?.user.name,
          image: session.user.image
        }, data.token);

        const filter = { type: 'messaging', members: { $in: [data.userId] } };
        const sort = [{ last_message_at: -1 }];
        const channels = await chatClient.queryChannels(filter, sort, {
          watch: true,
          state: true,
        });

        if (channels.length > 0) {
          setActiveChannel(channels[0]); // Automatically set the first channel as active
          await channels[0].watch(); // Watch the first channel
        }

        setClient(chatClient);
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    initChat();

    return () => {
      if (client) {
        client.disconnectUser().then(() => console.log("User disconnected successfully"));
      }
    };
  }, [session, otherUserId]);

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
    <div className='str-chat'>
      <Chat client={client}>
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
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          )}
        </div>
      </Chat>
      <style jsx>{`
        .str-chat {
          display: flex;
          height: 100vh;
        }
        .channel-list {
          width: 30%;  /* Updated to take up 40% of the screen */
          border-right: 1px solid #ddd;
          padding: 10px;
          overflow-y: auto;
        }
        .channel-messages {
          width: 70%;  /* Updated to take up the remaining 60% */
          display: flex;
          flex-direction: column;
        }
        .channel-preview__container {
          padding: 10px;
          border-radius: 4px;
          background-color: #f0f0f0;
          margin-bottom: 8px;
          cursor: pointer;
        }
        .channel-preview__container:hover, .channel-preview__container.selected {
          background-color: #e0e0e0;
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
  );
};

export default RegChatsPage;
