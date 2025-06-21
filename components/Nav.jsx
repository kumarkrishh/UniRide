"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Logout from '@mui/icons-material/Logout';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from "next/navigation";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import { AnimatePresence, motion } from 'framer-motion';

const theme = createTheme({
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2a394b',
          color: '#fff',
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '& .MuiListItemIcon-root': {
            color: '#fff',
          }
        }
      }
    }
  }
});

const Nav = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.push('/available-rideshares');
    }
  }, [status]);

  const sessionStatus = useMemo(() => {
    return { session, status };
  }, [session, status]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleMobileLinkClick = (href) => {
    setMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <div className='w-full flex justify-center fixed top-0 z-50'>
      <nav className='flex-between w-full max-w-6xl px-4 py-2 bg-[#1c2530]/80 backdrop-blur-md shadow-md border border-white/10 rounded-full mt-4'>
        <Link href='/' className='flex gap-2 flex-center mt-1'>
          <Image
            src='/assets/images/logo5.png'
            alt='logo'
            width={125}
            height={30}
            className='object-contain'
          />
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden lg:flex'>
          {session?.user ? (
            <div className='flex gap-3 md:gap-5'>
              <Link href='/available-rideshares' className='black_btn'>Find RideShares</Link>
              <Link href='/create-prompt' className='black_btn'>Create RideShares</Link>
              <Link href='/my-trips' className='black_btn'>My Trips</Link>
              <Link href='/chatlist' className='black_btn'>Messages</Link>
              <ThemeProvider theme={theme}>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleMenuClick}>
                  <Image
                    src={session.user.image}
                    width={37}
                    height={37}
                    className='rounded-full border border-white transition-transform duration-300 hover:scale-110'
                    alt='profile'
                  />
                  <KeyboardArrowDownIcon sx={{ color: '#fff', transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  style={{ marginTop: '10px' }}
                  sx={{ '& .MuiMenuItem-root:hover': { backgroundColor: '#39495e' } }}
                >
                  <MenuItem onClick={() => { router.push("/edit-profile") }}>
                    <ListItemIcon><AccountCircleOutlinedIcon fontSize="small" /></ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { router.push("/mynotifications") }}>
                    <ListItemIcon><NotificationsNoneOutlinedIcon fontSize="small" /></ListItemIcon>
                    Notifications
                  </MenuItem>
                  <Divider sx={{ borderColor: '#ffffff' }} />
                  <MenuItem onClick={handleSignOut}>
                    <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </ThemeProvider>
            </div>
          ) : (
            <div className='flex gap-3 md:gap-5'>
              <Link href='/available-rideshares' className='black_btn'>Find RideShares</Link>
              {providers && Object.values(providers).map((provider) => (
                <button
                  type='button'
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className='black_btn'
                >Sign in</button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className='lg:hidden flex items-center'>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <CloseIcon sx={{ color: '#fff' }} /> : <MenuIcon sx={{ color: '#fff' }} />}
          </button>
        </div>
      </nav>

      {/* Animated Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className='lg:hidden absolute top-[70px] w-full max-w-6xl px-4 py-4 bg-[#1c2530] rounded-lg shadow-lg z-40'
          >
            {session?.user ? (
              <>
                <button onClick={() => handleMobileLinkClick('/available-rideshares')} className='block w-full text-left px-4 py-2 text-white hover:bg-[#2a394b] rounded'>Find RideShares</button>
                <button onClick={() => handleMobileLinkClick('/create-prompt')} className='block w-full text-left px-4 py-2 text-white hover:bg-[#2a394b] rounded'>Create RideShares</button>
                <button onClick={() => handleMobileLinkClick('/my-trips')} className='block w-full text-left px-4 py-2 text-white hover:bg-[#2a394b] rounded'>My Trips</button>
                <button onClick={() => handleMobileLinkClick('/chatlist')} className='block w-full text-left px-4 py-2 text-white hover:bg-[#2a394b] rounded'>Messages</button>
                <button onClick={() => handleMobileLinkClick('/mynotifications')} className='block w-full text-left px-4 py-2 text-white hover:bg-[#2a394b] rounded'>Notifications</button>
                <button onClick={() => handleMobileLinkClick('/edit-profile')} className='block w-full text-left px-4 py-2 text-white hover:bg-[#2a394b] rounded'>Profile</button>
                <button onClick={() => { setMobileMenuOpen(false); handleSignOut(); }} className='block w-full text-left px-4 py-2 text-white hover:bg-[#2a394b] rounded'>Sign Out</button>
              </>
            ) : (
              <>
                <button onClick={() => handleMobileLinkClick('/available-rideshares')} className='block w-full text-left px-4 py-2 text-white hover:bg-[#2a394b] rounded'>Find RideShares</button>
                {providers && Object.values(providers).map((provider) => (
                  <button
                    key={provider.name}
                    onClick={() => { setMobileMenuOpen(false); signIn(provider.id); }}
                    className='block w-full text-left px-4 py-2 text-white hover:bg-[#2a394b] rounded'
                  >Sign in</button>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Nav;
