import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableChartIcon from '@mui/icons-material/TableChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 훅

const Sidebar = () => {
  const navigate = useNavigate(); // 페이지 이동 훅

  // 메뉴 항목 및 링크 설정
  const menuItems = [
    { text: '대시보드', icon: <DashboardIcon />, link: '/admin' },
    { text: '회사 관리', icon: <TableChartIcon />, link: '/admin/companies' }, // 회사 관리 링크 추가
    { text: '카테고리 관리', icon: <TableChartIcon />, link: '/admin/categories' }, // 회사 관리 링크 추가
    { text: '제품 관리', icon: <TableChartIcon />, link: '/admin/products' }, // 회사 관리 링크 추가
    { text: 'Billing', icon: <AttachMoneyIcon />, link: '/admin/billing' },
    { text: 'Notifications', icon: <NotificationsIcon />, link: '/admin/notifications' },
    { text: 'Profile', icon: <AccountCircleIcon />, link: '/admin/profile' },
    { text: 'Sign In', icon: <LoginIcon />, link: '/login' },
    { text: 'Sign Up', icon: <AppRegistrationIcon />, link: '/signup' },
  ];

  return (
    <Box
      sx={{
        width: 240,
        height: '80vh',
        backgroundColor: '#343a40',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        borderRadius: '12px',
        margin: '10px',
        marginTop: '15px',
      }}
    >
      <Box sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', mb: 2, marginTop: '8px' }}>
        Deskit
      </Box>
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            sx={{
              '&:hover': { backgroundColor: '#495057' },
              color: '#adb5bd',
              mb: 1,
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            onClick={() => navigate(item.link)} // 페이지 이동 추가
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