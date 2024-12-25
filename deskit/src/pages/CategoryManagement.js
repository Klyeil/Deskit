import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]); // 서버 데이터로 관리
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/categories/list');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // 카테고리 추가
  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const response = await axios.post('http://localhost:3001/categories/add', {
          name: newCategory,
        });
        setCategories([...categories, response.data.category]); // 로컬 상태 업데이트
        setNewCategory('');
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  // 카테고리 삭제
  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/categories/delete/${id}`);
      setCategories(categories.filter((category) => category._id !== id)); // 로컬 상태 업데이트
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // 카테고리 수정
  const handleEditCategory = (id, name) => {
    setEditCategory({ id, name });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditCategory(null);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/categories/update/${editCategory.id}`, {
        name: editCategory.name,
      });
      setCategories(
        categories.map((category) =>
          category._id === editCategory.id ? response.data.category : category
        )
      );
      handleDialogClose();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box sx={{ flexGrow: 1, padding: '20px', backgroundColor: '#f8f9fa' }}>
        <Typography variant="h5" gutterBottom>
          카테고리 관리
        </Typography>

        {/* 카테고리 추가 */}
        <Box display="flex" alignItems="center" gap={2} my={3}>
          <TextField
            label="새 카테고리 이름"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleAddCategory}>
            추가
          </Button>
        </Box>

        {/* 카테고리 목록 */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>카테고리 이름</TableCell>
                <TableCell>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={category._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditCategory(category._id, category.name)}
                      sx={{ mr: 1 }}
                    >
                      수정
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteCategory(category._id)}
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
          <DialogTitle>카테고리 수정</DialogTitle>
          <DialogContent>
            <TextField
              label="카테고리 이름"
              value={editCategory?.name || ''}
              onChange={(e) =>
                setEditCategory((prev) => ({ ...prev, name: e.target.value }))
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

export default CategoryManagement;