import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem } from '@mui/material';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import '../styles/ProductManagement.css';

const ProductManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '' });

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:3001/companies/list'),
          axios.get('http://localhost:3001/categories/list'),
        ]);
        setCompanies(companiesResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // 특정 회사의 제품 로드
  const fetchProducts = async (companyId) => {
    try {
      console.log('Requesting products for companyId:', companyId); // 디버깅용
      const response = await axios.get(`http://localhost:3001/products/company/${companyId}`);
      console.log('Response data:', response.data); // 서버 응답 데이터 확인
      setProducts(response.data);
      setSelectedCompany(companyId);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // 모달 열기
  const openDialog = () => setIsDialogOpen(true);

  // 모달 닫기
  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewProduct({ name: '', category: '', price: '' });
  };

  // 새 제품 저장
  const saveProduct = async () => {
    // 가격 필드가 비어 있는지 확인
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      alert('모든 필드를 입력하세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/products/add', {
        name: newProduct.name,
        company: selectedCompany,
        category: newProduct.category,
        price: newProduct.price, // 가격 추가
      });

      setProducts((prev) => [...prev, response.data.product]);
      closeDialog();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('제품 저장에 실패했습니다.');
    }
  };

  return (
    <Box display="flex">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <Box sx={{ flexGrow: 1, padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom>
          제품 관리
        </Typography>

        {/* 회사 목록 */}
        {!selectedCompany ? (
          <Grid container spacing={2}>
            {companies.map((company) => (
              <Grid item xs={12} sm={6} md={4} key={company._id}>
                <Card
                  onClick={() => fetchProducts(company._id)}
                  sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { boxShadow: 3 } }}
                >
                  <CardContent>
                    <Typography variant="h6">{company.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <Button variant="contained" onClick={() => setSelectedCompany(null)} sx={{ marginBottom: 2 }}>
              회사 목록으로 돌아가기
            </Button>
            <Typography variant="h5">
              {companies.find((c) => c._id === selectedCompany)?.name}의 제품 목록
            </Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={openDialog}>
              새 제품 추가
            </Button>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography variant="body2">
                        카테고리: {categories.find((cat) => cat._id === product.category)?.name || '알 수 없음'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* 새 제품 추가 모달 */}
        <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle>새 제품 추가</DialogTitle>
          <DialogContent>
            <TextField
              label="제품명"
              fullWidth
              margin="dense"
              value={newProduct.name}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
            />
            <Typography>카테고리</Typography>
            <Select
              fullWidth
              value={newProduct.category}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="가격"
              fullWidth
              margin="dense"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>취소</Button>
            <Button variant="contained" color="primary" onClick={saveProduct}>
              저장
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ProductManagement;