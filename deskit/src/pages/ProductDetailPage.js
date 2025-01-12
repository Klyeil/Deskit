import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ProductDetailPage.css";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("description");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/products/${productId}`
        );
        const productData = response.data;

        // 상태 설정
        setProduct(productData);
        setSelectedColor(productData.colors?.[0] || null);
        setSelectedSize(productData.sizes?.[0] || null);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>No product found.</p>;

  return (
    <div className="product-detail">
      {/* 상단 레이아웃: 이미지와 옵션 */}
      <div className="product-top">
        <div className="image-section">
          <img
            src={`http://localhost:3001${product.image}`}
            alt={product.name}
            className="main-image"
          />
          <div className="thumbnail-images">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:3001${img}`}
                alt={`Thumbnail ${index}`}
                className="thumbnail"
              />
            ))}
          </div>
        </div>
        <div className="info-section">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-reference">Reference By: {product.reference}</p>
          <p className="product-price">₩{product.price.toLocaleString()}</p>
          <p className="product-stock">
            {product.stock > 0 ? `${product.stock} IN STOCK` : "OUT OF STOCK"}
          </p>
          <div className="options">
            {product.colors?.length > 0 && (
              <div className="color-options">
                <span>Color:</span>
                <div className="colors">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className={`color-circle ${
                        selectedColor === color ? "selected" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    ></span>
                  ))}
                </div>
              </div>
            )}
            {product.sizes?.length > 0 && (
              <div className="size-options">
                <label htmlFor="size-select">Option:</label>
                <select
                  id="size-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="quantity-add-to-cart">
            <div className="quantity">
              <label htmlFor="quantity">수량</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                max={product.stock}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <button className="add-to-cart-btn">+ Add to Cart</button>
          </div>
        </div>
      </div>
  
      {/* 탭 섹션 */}
      <div className="tabs">
        <div className="tab-buttons">
          <button
            className={selectedTab === "description" ? "active" : ""}
            onClick={() => setSelectedTab("description")}
          >
            상세 설명
          </button>
          <button
            className={selectedTab === "info" ? "active" : ""}
            onClick={() => setSelectedTab("info")}
          >
            상품 정보
          </button>
          <button
            className={selectedTab === "reviews" ? "active" : ""}
            onClick={() => setSelectedTab("reviews")}
          >
            리뷰
          </button>
          <button
            className={selectedTab === "shipping" ? "active" : ""}
            onClick={() => setSelectedTab("shipping")}
          >
            배송 정보
          </button>
        </div>
        <div className="tab-content">
          {selectedTab === "description" && (
            <div>
              <h2>상세 설명</h2>
              <p>{product.description}</p>
            </div>
          )}
          {selectedTab === "info" && (
            <div>
              <h2>상품 정보</h2>
              <p>상품 관련 추가 정보를 여기에 작성하세요.</p>
            </div>
          )}
          {selectedTab === "reviews" && (
            <div>
              <h2>리뷰</h2>
              <p>리뷰 섹션입니다.</p>
            </div>
          )}
          {selectedTab === "shipping" && (
            <div>
              <h2>배송 정보</h2>
              <p>배송 관련 정보를 여기에 작성하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;