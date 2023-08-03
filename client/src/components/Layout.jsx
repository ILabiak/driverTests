/* eslint-disable jsx-a11y/anchor-is-valid */
import logo from '../media/logo.png';
import React from 'react';
import './layout.css';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';

const pages = ['Тести з ПДР', 'Іспит з водіння'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

// function Layout(props) {
//   const {
//     showDropdown,
//     isAuthenticated,
//     userEmail,
//     handleProfileIconClick,
//     handleLogout,
//     handleLoginLinkClick
//   } = props;

//   return (
//     <header className='App-header'>
//       <div className='headerContainer'>
//         <a href='/'>
//           <img src={logo} className='App-logo' alt='logo' />
//         </a>
//         <ul className='headerList'>
//           <li>
//             <a href='/sections'>Тести з ПДР</a>
//           </li>
//           <li>
//             <a href='/exam'>Іспит з водіння</a>
//           </li>
//           <li className={showDropdown ? 'headerProfileActive' : ''}>
//             {isAuthenticated ? (
//               <div className="profileContainer">
//                 <div className="action" onClick={handleProfileIconClick}>
//                   <div className="profile">
//                     <img src={profileIcon} alt="profile-img" />
//                   </div>
//                   <div className={`menu ${showDropdown ? 'active' : ''}`}>
//                     <h3>
//                       {userEmail}<br />
//                       <span>Звичайний користувач</span>
//                     </h3>
//                     <ul>
//                       <li>
//                         <a href="#">Мій профіль</a>
//                       </li>
//                       <li>
//                         <a href="/sections">Teсти</a>
//                       </li>
//                       <li>
//                         <i className="far fa-envelope"></i>
//                         <a onClick={handleLogout}>Вийти</a>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <li>
//                 <a onClick={handleLoginLinkClick}>
//                   Особистий кабінет
//                 </a>
//               </li>

//             )}
//           </li>
//         </ul>
//       </div>
//     </header>
//   );
// }

function Layout(props) {
  const {
    showDropdown,
    isAuthenticated,
    userEmail,
    handleProfileIconClick,
    handleLogout,
    handleLoginLinkClick
  } = props;

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static"
      style={{ background: 'white' }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
            }}>
            <a href='/'>
              <img src={logo} className='App-logo' alt='logo' />
            </a>
          </Box >

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="black"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <a href="/sections" style={{ textDecoration: 'none' }}>
                <MenuItem key={'pdr-tests'}>
                  <Typography textAlign="center" sx={{ color: 'black' }}>{'Тести ПДР'}</Typography>
                </MenuItem>
              </a>
              <a href="/exam" style={{ textDecoration: 'none' }}>
                <MenuItem key={'exam'}>
                  <Typography textAlign="center" sx={{ color: 'black' }}>{'Іспит з водіння'}</Typography>
                </MenuItem>
              </a>
            </Menu>
          </Box>
          <Box
            variant="h5"
            noWrap
            component="a"
            href="" sx={{ display: { xs: 'flex', md: 'none' }, mr: 2, flexGrow: 1 }}>
            <a href='/'>
              <img src={logo} className='App-logo' alt='logo' />
            </a>
          </Box >
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              key={'pdr-tests'}
              href='/sections'
              sx={{ my: 2, color: 'black', display: 'block' }}
            >
              Тести ПДР
            </Button>
            <Button
              key={'exam'}
              href='/exam'
              sx={{ my: 2, color: 'black', display: 'block' }}
            >
              Іспит з водіння
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <Tooltip title="Profile">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp"
                    // src={"/static/images/avatar/2.jp"}
                    sx={{
                      color: 'black'
                    }}
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Login">
                <IconButton onClick={handleLoginLinkClick} sx={{ p: 0 }}>
                  <LoginIcon fontSize='large' />
                </IconButton>
              </Tooltip>

            )}

            <Menu
              sx={{ mt: '45px', }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Layout;
