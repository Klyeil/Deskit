import React from 'react';
import '../styles/ProductList.css';

const ProductList = ({ products }) => {
  return (
    <div className="product-list">
      <h3>📋 사용된 제품 정보</h3>
      <ul>
        {products && products.length > 0 ? (
          products.map((product) => (
            <li key={product._id} className="product-item">
              <span>{product.name}</span> -{' '}
              <a href={product.link} target="_blank" rel="noopener noreferrer">
                구매 링크
              </a>
            </li>
          ))
        ) : (
          <p>제품 정보가 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default ProductList;