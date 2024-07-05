"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { useSession } from 'next-auth/react';
import Grid from '@mui/material/Grid';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';

const UserProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (session?.user.id) {
          const response = await fetch(`/api/fetchprofile/${session.user.viewuserid}`);
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user.id]);

  if (loading) {
    return (
      <Box sx={{
        backgroundColor: '#141d26',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{
        backgroundColor: '#141d26',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
      }}>
        <Typography variant="h6" color="textSecondary">User not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      backgroundColor: '#141d26',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 3,
    }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{
          padding: 5,
          borderRadius: 3,
          textAlign: 'center',
          backgroundColor: '#1e2a38',
          color: '#fff',
        }}>
          <Avatar alt={user.username} src={user.image} sx={{
            width: 180,
            height: 180,
            margin: '0 auto',
            marginBottom: 3,
          }} />
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            {user.username}
          </Typography>
          <Grid container spacing={3} sx={{ marginTop: 3 }}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <EmailIcon sx={{ marginRight: 1, color: '#b0b3b8' }} />
                <Typography variant="h6" sx={{ color: '#b0b3b8' }}>
                  {user.email}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <SchoolIcon sx={{ marginRight: 1, color: '#b0b3b8' }} />
                <Typography variant="h6" sx={{ color: '#b0b3b8' }}>
                  {user.college}
                </Typography>
              </Box>
            </Grid>
            {user.number && (
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center">
                  <PhoneIcon sx={{ marginRight: 1, color: '#b0b3b8' }} />
                  <Typography variant="h6" sx={{ color: '#b0b3b8' }}>
                    Phone: {user.number}
                  </Typography>
                </Box>
              </Grid>
            )}
            {user.bio && (
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <InfoIcon sx={{ marginRight: 1, color: '#b0b3b8' }} />
                  <Typography variant="h6" sx={{ color: '#b0b3b8' }}>
                    {user.bio}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserProfile;
