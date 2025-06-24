"use client";

import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
  ChannelList
} from 'stream-chat-react';
import { useSession } from 'next-auth/react';
import 'stream-chat-react/dist/css/index.css';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const RegChatsPage = ({ otherUserId }) => {
  const [client, setClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    const initChat = async () => {
      try {
        const response = await fetch(`/api/newchatuser/${session.user.id}/gettoken`);
        const data = await response.json();

        const chatClient = StreamChat.getInstance('mn3h6qnhxxpz');
        await chatClient.connectUser(
          { id: data.userId, name: session.user.name, image: session.user.image },
          data.token
        );

        const filter = { type: 'messaging', members: { $in: [data.userId] } };
        const sort = [{ last_message_at: -1 }];
        const channels = await chatClient.queryChannels(filter, sort, { watch: true, state: true });

        if (channels.length > 0) {
          setActiveChannel(channels[0]);
          await channels[0].watch();
        }

        setClient(chatClient);
      } catch (err) {
        console.error("Error initializing chat:", err);
      }
    };

    initChat();
    return () => client?.disconnectUser();
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
    <div className="rounded-lg bg-black" style={{ height: "calc(100vh - 100px)", marginTop: '20px' }}>
      <div className='str-chat'>
        <Chat client={client} theme="messaging dark">
          <div className="channel-list-container">
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
                        {Object.values(previewProps.channel?.state.members || {})
                          .filter(m => m.user_id !== session.user.id)
                          .map(m => m.user.name)
                          .join(', ') || 'Unknown User'}
                      </p>
                      <p className="channel-preview__content-time">
                        {new Date(previewProps.channel?.state.last_message_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="channel-preview__content-message">
                      {previewProps.channel?.state.messages.at(-1)?.text || 'No messages yet'}
                    </p>
                  </div>
                </div>
              )}
            />
          </div>

          <div className="channel-messages">
            {activeChannel && (
              <Channel channel={activeChannel}>
                <Window>
                  <ChannelHeader />
                  <div className="message-list-wrapper">
                    <MessageList className="bg-black" />
                  </div>
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
  flex-direction: row;
  background-color: #1c262f;
  height: 100%;
  width: 100%;
  overflow: hidden;
  border: 1px solid #2e3b4e;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.4);
}

.channel-list-container {
  width: 30%;
  background-color: #1f2a36 !important;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #2e3b4e;
  padding: 12px 8px;
}

.channel-messages {
  width: 70%;
  display: flex;
  flex-direction: column;
  background-color: #141d26 !important;
  height: 100%;
  overflow-y: auto;
  border-left: 1px solid #2e3b4e;
  padding-top: 4px;
}

.channel-messages::-webkit-scrollbar {
  width: 8px;
}

.channel-messages::-webkit-scrollbar-thumb {
  background-color: #3c5567;
  border-radius: 4px;
}

.channel-messages::-webkit-scrollbar-track {
  background-color: transparent;
}


.message-list-wrapper {
  flex-grow: 1;
  padding: 8px 12px;
}

.message-list-wrapper::-webkit-scrollbar {
  width: 8px;
}

.message-list-wrapper::-webkit-scrollbar-thumb {
  background-color: #3c5567;
  border-radius: 4px;
}

.channel-preview__container {
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  background-color: #2b3a47;
  border: 1px solid transparent;
  transition: background 0.2s ease, border 0.2s ease;
}

.channel-preview__container:hover {
  border-color: #465d6f;
}

.channel-preview__container.selected {
  background-color: #3c5567;
  border-color: #5e7c91;
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
  color: white;
}

.channel-preview__content-time {
  font-size: 0.75rem;
  color: white;
}

.channel-preview__content-message {
  font-size: 0.875rem;
  color: white;
}

@media screen and (max-width: 768px) {
  .str-chat {
    flex-direction: column;
  }

  .channel-list-container {
    display: none;
  }

  .channel-messages {
    width: 100%;
    height: auto;
  }
}
`}</style>

      </div>
    </div>
  );
};

export default RegChatsPage;
