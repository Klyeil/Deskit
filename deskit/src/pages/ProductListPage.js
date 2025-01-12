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
  const [sortOption, setSortOption] = useState('newest'); // 기본 정렬 옵션

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products/list');
        setProducts(response.data);
        setFilteredProducts(response.data); // 초기 상태로 전체 제품 설정
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

  // 가격 필터링 적용
  useEffect(() => {
    const filterByPrice = () => {
      let filtered = products.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      // 정렬 적용
      if (sortOption === 'price-low-to-high') {
        filtered = filtered.sort((a, b) => a.price - b.price); // 가격 낮은 순
      } else if (sortOption === 'price-high-to-low') {
        filtered = filtered.sort((a, b) => b.price - a.price); // 가격 높은 순
      } else if (sortOption === 'newest') {
        filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신순
      }

      setFilteredProducts(filtered);
    };

    filterByPrice();
  }, [priceRange, sortOption, products]); // priceRange, sortOption, products가 변경될 때마다 필터링

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceChange = (values) => {
    setPriceRange(values);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value); // 선택된 정렬 옵션 설정
  };

  return (
    <div className="product-page-layout">
      {/* 필터 사이드바 */}
      <aside className="sidebars">
        <h3 className="sidebar-title">CATEGORIES</h3>
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category._id} className="category-item">
              <button onClick={() => handleCategorySelect(category.name)}>
                {category.name}
              </button>
            </li>
          ))}
        </ul>

        <h3 className="sidebar-title">FILTER BY PRICE</h3>
        <div className="price-filter">
          <Slider
            className="price-slider"
            value={priceRange}
            min={0}
            max={1000000}
            step={10000}
            onChange={handlePriceChange}
            renderTrack={(props, state) => {
              if (!props || !state) return null;

              const backgroundStyle = '#ddd';

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
              if (!props) return null;

              return (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: '20px',
                    width: '20px',
                    backgroundColor: '#a593e0',
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
          <span>Showing {filteredProducts.length} results</span>
          <select className="sort-select" onChange={handleSortChange} value={sortOption}>
            <option value="newest">Sort by newness</option>
            <option value="price-low-to-high">Price: Low to High</option>
            <option value="price-high-to-low">Price: High to Low</option>
          </select>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
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