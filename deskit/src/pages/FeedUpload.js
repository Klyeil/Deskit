import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import axios from 'axios';

const FeedUpload = () => {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [image, setImage] = useState(null);

  // 회사 및 카테고리 데이터 가져오기
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
        console.error('Error fetching companies or categories:', error);
      }
    };

    fetchData();
  }, []);

  // 필터링된 제품 가져오기
  const fetchFilteredProducts = async () => {
    if (!selectedCompany || !selectedCategory) {
      setProducts([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/products/filter?company=${selectedCompany}&category=${selectedCategory}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    }
  };

  // 회사 또는 카테고리 선택 변경 시 필터링
  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCompany, selectedCategory]);

  // 이미지 변경 핸들러
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // 제품 선택 핸들러
  const toggleProductSelection = (product) => {
    setSelectedProducts((prev) =>
      prev.find((p) => p._id === product._id)
        ? prev.filter((p) => p._id !== product._id) // 선택 해제
        : [...prev, product] // 선택 추가
    );
  };

  // 업로드 핸들러
  const handleSubmit = async () => {
    if (!image || selectedProducts.length === 0) {
      alert('이미지와 제품을 선택하세요.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('company', selectedCompany);
    formData.append('category', selectedCategory);
    formData.append('products', JSON.stringify(selectedProducts)); // 선택된 제품들

    try {
      const response = await axios.post('http://localhost:3001/feeds/upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('피드 업로드 성공!');
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드 실패!');
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        피드 업로드
      </Typography>

      {/* 이미지 업로드 */}
      <Typography gutterBottom>이미지 업로드</Typography>
      <input type="file" onChange={handleImageChange} />

      {/* 회사 선택 */}
      <Typography gutterBottom>회사 선택</Typography>
      <Select
        fullWidth
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
      >
        {companies.map((company) => (
          <MenuItem key={company._id} value={company._id}>
            {company.name}
          </MenuItem>
        ))}
      </Select>

      {/* 카테고리 선택 */}
      <Typography gutterBottom>카테고리 선택</Typography>
      <Select
        fullWidth
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((category) => (
          <MenuItem key={category._id} value={category._id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>

      {/* 제품 목록 */}
      <Typography gutterBottom>제품 선택</Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Button
              variant={selectedProducts.some((p) => p._id === product._id) ? 'contained' : 'outlined'}
              onClick={() => toggleProductSelection(product)}
            >
              {product.name} ({product.price}원)
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* 선택된 제품 목록 */}
      <Typography gutterBottom sx={{ marginTop: 2 }}>
        선택된 제품 목록
      </Typography>
      <List>
        {selectedProducts.map((product) => (
          <ListItem key={product._id}>
            <ListItemText primary={`${product.name} (${product.price}원)`} />
          </ListItem>
        ))}
      </List>

      {/* 업로드 버튼 */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        sx={{ marginTop: 2 }}
      >
        업로드
      </Button>
    </Box>
  );
};

export default FeedUpload;