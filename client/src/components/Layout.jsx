/* eslint-disable jsx-a11y/anchor-is-valid */
import logo from '../media/logo.png';
import React from 'react';
import profileIcon from '../media/profile-icon.png';
import './layout.css';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

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

function Layout() {
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
    style={{background: 'white'}}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Box               
              noWrap
              component="a"
              sx = {{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
              }}>
          <a href='/'>
            <img src={logo} className='App-logo' alt='logo' />
          </a>
          </Box >

          {/* <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              Driving Tests
            </Typography> */}

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
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
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" sx={{color: 'black'}}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box             
          variant="h5"
            noWrap
            component="a"
            href="" sx={{ display: { xs: 'flex', md: 'none'}, mr: 2, flexGrow: 1 }}>
          <a href='/'>
            <img src={logo} className='App-logo' alt='logo' />
          </a>
          </Box >
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          {/* <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Logo
          </Typography> */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" 
                // src={"/static/images/avatar/2.jpg"}
                />  
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
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
