import React, { useState, useEffect } from 'react';
import {Box,Typography,Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,TextField,Dialog,DialogActions,DialogContent,DialogTitle,} from '@mui/material';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import '../styles/CompanyManagement.css';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]); // 서버 데이터로 관리
  const [newCompany, setNewCompany] = useState('');
  const [editCompany, setEditCompany] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:3001/companies/list');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  // 회사 추가
  const handleAddCompany = async () => {
    if (newCompany.trim()) {
      try {
        const response = await axios.post('http://localhost:3001/companies/add', {
          name: newCompany,
        });
        setCompanies([...companies, response.data.company]); // 로컬 상태 업데이트
        setNewCompany('');
      } catch (error) {
        console.error('Error adding company:', error);
      }
    }
  };

  // 회사 삭제
  const handleDeleteCompany = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/companies/delete/${id}`);
      setCompanies(companies.filter((company) => company._id !== id)); // 로컬 상태 업데이트
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  // 회사 수정
  const handleEditCompany = (id, name) => {
    setEditCompany({ id, name });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditCompany(null);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/companies/update/${editCompany.id}`, {
        name: editCompany.name,
      });
      setCompanies(
        companies.map((company) =>
          company._id === editCompany.id ? response.data.company : company
        )
      );
      handleDialogClose();
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box sx={{ flexGrow: 1, padding: '20px', backgroundColor: '#f8f9fa' }}>
        <Typography variant="h5" gutterBottom>
          회사 관리
        </Typography>

        {/* 회사 추가 */}
        <Box display="flex" alignItems="center" gap={2} my={3}>
          <TextField
            label="새 회사 이름"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleAddCompany}>
            추가
          </Button>
        </Box>

        {/* 회사 목록 */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>회사 이름</TableCell>
                <TableCell>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company, index) => (
                <TableRow key={company._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditCompany(company._id, company.name)}
                      sx={{ mr: 1 }}
                    >
                      수정
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteCompany(company._id)}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 수정 다이얼로그 */}
        <Dialog open={isDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>회사 수정</DialogTitle>
          <DialogContent>
            <TextField
              label="회사 이름"
              value={editCompany?.name || ''}
              onChange={(e) =>
                setEditCompany((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>취소</Button>
            <Button onClick={handleSaveEdit} variant="contained" color="primary">
              저장
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CompanyManagement;