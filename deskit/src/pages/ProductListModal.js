import React from "react";
import PropTypes from "prop-types";
import { AiOutlineClose } from "react-icons/ai"; // 닫기 아이콘 추가
import "../styles/ProductListModal.css";

const ProductListModal = ({ products, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 닫기 아이콘 */}
        <AiOutlineClose className="close-icon" onClick={onClose} />

        
        {products && products.length > 0 ? (
          <ul className="product-list">
            {products.map((product, index) => (
              <li key={index} className="product-item">
                <p className="product-name">{product.productId?.name || "알 수 없음"}</p>
                <p className="product-price">{product.productId?.price?.toLocaleString()}원</p>
                <p className="product-company">by {product.productId?.company?.name || "알 수 없음"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>제품 정보가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

ProductListModal.propTypes = {
  products: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProductListModal;