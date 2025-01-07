import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProductDetailPage.css';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('상품 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-detail-page">
      <div className="product-image-section">
        <img src={`http://localhost:3001${product.image}`} alt={product.name} />
      </div>
      <div className="product-info-section">
        <h1>{product.name}</h1>
        <p className="product-price">₩{product.price.toLocaleString()}</p>
        <p className="product-description">{product.description}</p>
        <p className="product-category">카테고리: {product.category.name}</p>
        <p className="product-company">제조사: {product.company.name}</p>
        <p className="product-stock">재고: {product.stock > 0 ? `${product.stock}개` : '품절'}</p>
        <button className="add-to-cart-btn">장바구니에 추가</button>
        <button className="buy-now-btn">구매하기</button>
      </div>
    </div>
  );
};

export default ProductDetailPage;