import { StreamChat } from 'stream-chat';

export const POST = async (req, res) => {
  console.log("Request method:", req.method);
  if (req.method !== 'POST') {
    console.log("Expected POST, received", req.method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId, userName } = req.body;

  try {
    const serverClient = StreamChat.getInstance('mn3h6qnhxxpz', '3jmy6acxbdq3g8xzfq3x8pfqrpartv3muqx6ywg52umtm7ry56k95xqwt48fwzb2');
    const token = serverClient.createToken(userId);

    await serverClient.upsertUser({
      id: userId,
      name: userName,
      image: `https://getstream.io/random_png/?name=${userName}`
    });

    res.status(200).json({ token, userId, userName });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};
