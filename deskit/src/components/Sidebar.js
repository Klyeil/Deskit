import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableChartIcon from '@mui/icons-material/TableChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const Sidebar = () => {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Billing', icon: <AttachMoneyIcon /> },
    { text: 'Tables', icon: <TableChartIcon /> },
    { text: 'Notifications', icon: <NotificationsIcon /> },
    { text: 'Profile', icon: <AccountCircleIcon /> },
    { text: 'Sign In', icon: <LoginIcon /> },
    { text: 'Sign Up', icon: <AppRegistrationIcon /> },
  ];

  return (
    <Box
      sx={{
        width: 240,
        height: '80vh', // 높이를 약간 줄여서 떠 있는 느낌을 강화
        backgroundColor: '#343a40',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        borderRadius: '12px', // 둥근 모서리 추가
        margin: '10px', // 벽에서 떨어진 느낌을 위해 여백 추가
        marginTop : '15px'
      }}
    >
      <Box sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', mb: 2, marginTop: '8px' }}>
        Deskit
      </Box>
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            component="li"
            key={index}
            sx={{
              '&:hover': { backgroundColor: '#495057' },
              color: '#adb5bd',
              mb: 1,
              borderRadius: '8px',
            }}
          >
            <ListItemIcon sx={{ color: '#adb5bd' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
