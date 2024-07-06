"use client";

import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
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
    <div className='str-chat'>
      <Chat client={client}>
        <div className="channel-list">
          {channels.map((channel) => {
            const members = Object.values(channel.state.members);
            return (
              <div
                key={channel.id}
                className={`channel-preview__container ${activeChannel && activeChannel.id === channel.id ? 'selected' : ''}`}
                onClick={() => setActiveChannel(channel)}
              >
                <div className="channel-preview__content-wrapper">
                  <div className="channel-preview__content-top">
                    <p className="channel-preview__content-name">
                      {channel.data.name || members
                        .filter(member => member.user.id !== session.user.id)
                        .map(member => member.user.name)
                        .join(', ') || channel.id}
                    </p>
                    <p className="channel-preview__content-time">
                      {new Date(channel.state.last_message_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <p className="channel-preview__content-message">
                    {channel.state.messages.length > 0 ? channel.state.messages[channel.state.messages.length - 1].text : 'No messages yet'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
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
          width: 25%;
          border-right: 1px solid #ddd;
          padding: 10px;
          overflow-y: auto;
        }
        .channel-preview__container {
          height: 56px;
          margin-bottom: 8px;
          margin-left: 20px;
          margin-right: 20px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: 8px;
        }
        .channel-preview__container:hover {
          background: #ffffff;
          box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.07);
          transition: background 0.1s ease-in-out;
        }
        .str-chat.dark .channel-preview__container:hover {
          background: #2c2c30;
        }
        .channel-preview__container.selected {
          background: #ffffff;
          box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.07);
          transition: background 0.1s ease-in-out;
        }
        .str-chat.dark .channel-preview__container.selected {
          background: #2c2c30;
        }
        .channel-preview__content-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 8px;
          margin-right: 8px;
          width: 100%;
        }
        .channel-preview__content-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0;
          height: 18px;
          margin-bottom: 4px;
        }
        .channel-preview__content-name {
          font-family: Helvetica Neue, sans-serif;
          font-weight: 500;
          font-size: 15px;
          color: #000000;
          margin: 0;
          max-width: 158px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .str-chat.dark .channel-preview__content-name {
          color: #ffffff;
        }
        .channel-preview__content-time {
          font-family: Helvetica Neue, sans-serif;
          font-size: 11px;
          color: #858688;
          margin: 0;
        }
        .channel-preview__content-message {
          font-family: Helvetica Neue, sans-serif;
          font-size: 13px;
          line-height: 16px;
          margin: 0;
          color: #858688;
          height: 16px;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .channel-preview__container .str-chat__avatar {
          margin-right: 0;
        }
        .channel-preview__avatars {
          display: flex;
          align-items: center;
          height: 40px;
          min-width: 40px;
          max-width: 40px;
          border-radius: 20px;
          overflow: hidden;
        }
        .channel-preview__avatars.two div:first-child {
          position: relative;
          right: 10px;
        }
        .channel-preview__avatars.two div:nth-child(2) {
          position: relative;
          right: 30px;
        }
        .channel-preview__avatars.two span {
          width: 20px;
          overflow: hidden;
        }
        .channel-preview__avatars.three span {
          width: 20px;
          overflow: hidden;
        }
        .channel-messages {
          width: 75%;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

export default ChatsPage;
