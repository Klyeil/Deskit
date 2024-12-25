import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import axios from 'axios';
import '../styles/CompanyProducts.css';

const CompanyProducts = () => {
  const { companyId } = useParams(); // URL에서 회사 ID 가져오기
  const [products, setProducts] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await axios.get(`http://localhost:3001/products/company/${companyId}`);
        setProducts(productsResponse.data || []); // 빈 배열 처리

        const companyResponse = await axios.get(`http://localhost:3001/companies/list`);
        const company = companyResponse.data.find((comp) => comp._id === companyId);
        setCompanyName(company ? company.name : 'Unknown Company');
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [companyId]);

  if (loading) {
    return <Typography>로딩 중...</Typography>;
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        {companyName}의 제품 관리
      </Typography>
      {products.length === 0 ? (
        <Typography>등록된 제품이 없습니다.</Typography>
      ) : (
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2">카테고리: {product.category?.name || '알 수 없음'}</Typography>
                  <Typography variant="body2">가격: {product.price}원</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CompanyProducts;