import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const DashboardCard = ({ title, value, change }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}
    >
      <Typography variant="subtitle2" sx={{ color: '#6c757d' }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ margin: '10px 0', fontWeight: 'bold' }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: change > 0 ? '#28a745' : '#dc3545' }}>
        {change > 0 ? `+${change}%` : `${change}%`} since last week
      </Typography>
    </Paper>
  );
};

export default DashboardCard;
