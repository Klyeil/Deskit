import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slider';
import '../styles/ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products/list');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching product list:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/categories/list');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceChange = (values) => {
    setPriceRange(values);
  };

  return (
    <div className="product-page-layout">
      {/* 필터 사이드바 */}
      <aside className="sidebars">
        <h3 className="sidebar-title">Categories</h3>
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category._id} className="category-item">
              <button onClick={() => handleCategorySelect(category.name)}>
                {category.name}
              </button>
            </li>
          ))}
        </ul>

        <h3 className="sidebar-title">Filter by Price</h3>
        <div className="price-filter">
        <Slider
  className="price-slider"
  value={priceRange}
  min={0}
  max={1000000}
  step={10000}
  onChange={handlePriceChange}
  renderTrack={(props, state) => {
    // props와 state가 정의되어 있는지 확인
    if (!props || !state) return null;

    const backgroundStyle = state.index === 1
      ? 'linear-gradient(to right, #ddd, #7655E3)'
      : '#ddd';

    return (
      <div
        {...props}
        style={{
          ...props.style,
          height: '6px',
          background: backgroundStyle,
        }}
      />
    );
  }}
  renderThumb={(props) => {
    // props가 정의되어 있는지 확인
    if (!props) return null;

    return (
      <div
        {...props}
        style={{
          ...props.style,
          height: '20px',
          width: '20px',
          backgroundColor: '#7655E3',
          borderRadius: '50%',
          cursor: 'pointer',
          top: '-5px', // 중앙 정렬
        }}
      />
    );
  }}
/>
          <p className="price-range">
            ₩{priceRange[0].toLocaleString()} - ₩{priceRange[1].toLocaleString()}
          </p>
        </div>
      </aside>

      {/* 상품 목록 */}
      <main className="product-list">
        <div className="sorting-bar">
          <span>Showing {products.length} results</span>
          <select className="sort-select">
            <option value="newest">Sort by newness</option>
            <option value="price-low-to-high">Price: Low to High</option>
            <option value="price-high-to-low">Price: High to Low</option>
          </select>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-cards">
              <Link to={`/products/${product._id}`} className="product-link">
                <img
                  src={`http://localhost:3001${product.image}`}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-company">{product.company?.name}</p>
                  <p className="product-price">
                    ₩{product.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductListPage;

