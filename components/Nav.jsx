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
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useRouter } from "next/navigation";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';

const theme = createTheme({
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2a394b', // Soft Gray-Blue background
          color: '#fff', // White text color
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '& .MuiListItemIcon-root': {
            color: '#fff', // Ensures icon color is also white
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
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

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

  return (
    <div className='w-full flex justify-center mb-0 z-10'>
      <nav className='flex-between w-full max-w-6xl rounded-full px-6 mt-2 py-3 bg-[#2d3748] shadow-lg'>
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
        <div className='sm:flex hidden'>
          {sessionStatus.session?.user ? (
            <div className='flex gap-3 md:gap-5'>

              
              <Link href='/chatlist' className='black_btn'>
                Messages
              </Link>
              <Link href='/my-trips' className='black_btn'>
                My Trips
              </Link>
              <Link href='/create-prompt' className='black_btn'>
                Find RideShares
              </Link>
              <Link href='/available-rideshares' className='black_btn'>
                Available RideShares
              </Link>


              <ThemeProvider theme={theme}>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleMenuClick}>
                <Image
                  src={sessionStatus.session.user.image}
                  width={37}
                  height={37}
                  className='rounded-full border border-white transition-transform duration-300 hover:scale-110'
                  alt='profile'
                  onClick={handleMenuClick}
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
                style={{marginTop: '10px'}}
                sx={{
                  '& .MuiMenuItem-root:hover': {
                    backgroundColor: '#39495e', // Set to white or any bright color
                  }
                }}
                
              >
                
                <MenuItem onClick={() => {router.push("/edit-profile")}}>
                  <ListItemIcon>
                    <AccountCircleOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => {router.push("/mynotifications")}}>
                  <ListItemIcon>
                    <NotificationsIcon fontSize="small" />
                  </ListItemIcon>
                  Notifications
                </MenuItem>
                <Divider sx={{ borderColor: '#ffffff' }}/>
                
                <MenuItem onClick={ signOut }>
                  <ListItemIcon>
                    <Logout fontSize="small"  />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
              </ThemeProvider>
            </div>
          ) : (
            <>
              {providers &&
                Object.values(providers).map((provider) => (
                  <button
                    type='button'
                    key={provider.name}
                    onClick={() => signIn(provider.id)}
                    className='black_btn'
                  >
                    Sign in
                  </button>
                ))}
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className='sm:hidden flex relative'>
          {sessionStatus.session?.user ? (
            <div className='flex'>
              <Image
                src={sessionStatus.session.user.image}
                width={37}
                height={37}
                className='rounded-full'
                alt='profile'
                onClick={() => setToggleDropdown(!toggleDropdown)}
              />

              {toggleDropdown && (
                <div className='dropdown'>
                  <Link
                    href='/profile'
                    className='dropdown_link'
                    onClick={() => setToggleDropdown(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href='/create-prompt'
                    className='dropdown_link'
                    onClick={() => setToggleDropdown(false)}
                  >
                    Create Prompt
                  </Link>

                  <button
                    type='button'
                    onClick={() => {
                      setToggleDropdown(false);
                      signOut();
                    }}
                    className='mt-5 w-full black_btn'
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {providers &&
                Object.values(providers).map((provider) => (
                  <button
                    type='button'
                    key={provider.name}
                    onClick={() => signIn(provider.id)}
                    className='black_btn'
                  >
                    Sign in
                  </button>
                ))}
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Nav;
