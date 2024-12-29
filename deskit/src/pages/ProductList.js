import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ProductList.css';

const ProductList = ({ products }) => {
    return (
      <div className="product-info-sidebar">
        <h3>📋 사용된 제품 정보</h3>
        {products && products.length > 0 ? (
          <ul>
            {products.map((product, index) => (
              <li key={index} className="product-item">
                <span>제품명: {product.productId?.name || '알 수 없음'}</span>
                <span>가격: {product.productId?.price?.toLocaleString()}원</span>
                <span>회사: {product.productId?.company?.name || '알 수 없음'}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>제품 정보가 없습니다.</p>
        )}
      </div>
    );
  };

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      companyName: PropTypes.string, // 회사명
    })
  ),
};

export default ProductList;