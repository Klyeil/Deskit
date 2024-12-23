import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../pages/DashboardCard';

const AdminDashboard = () => {
  return (
    <Box display="flex">
      <Sidebar />
      <Box sx={{ flexGrow: 1, padding: '20px', backgroundColor: '#f8f9fa' }}>
        <Typography variant="h5" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="Bookings" value="281" change={55} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="Today's Users" value="2,300" change={3} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="Revenue" value="$34k" change={1} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="Followers" value="+91" change={-2} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
