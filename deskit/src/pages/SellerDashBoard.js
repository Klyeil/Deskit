import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SellerDashBoard.css';

const SellerDashboard = () => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    company: '',
    category: '',
    description: '',
    stock: '',
    image: null,
  });
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [companyResponse, categoryResponse] = await Promise.all([
          axios.get('http://localhost:3001/companies/list'),
          axios.get('http://localhost:3001/categories/list'),
        ]);
        setCompanies(companyResponse.data);
        setCategories(categoryResponse.data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    try {
      await axios.post('http://localhost:3001/products/add', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('제품이 성공적으로 등록되었습니다!');
    } catch (error) {
      console.error('제품 등록 오류:', error);
      alert('제품 등록에 실패했습니다.');
    }
  };

  return (
    <div className="seller-dashboard">
      <h1>판매자 대시보드</h1>
      <input type="text" name="name" placeholder="제품명" onChange={handleInputChange} />
      <input type="number" name="price" placeholder="가격" onChange={handleInputChange} />
      <select name="company" value={productData.company} onChange={handleInputChange}>
        <option value="">회사를 선택하세요</option>
        {companies.map((company) => (
          <option key={company._id} value={company._id}>
            {company.name}
          </option>
        ))}
      </select>
      <select name="category" value={productData.category} onChange={handleInputChange}>
        <option value="">카테고리를 선택하세요</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <textarea name="description" placeholder="제품 설명" onChange={handleInputChange}></textarea>
      <input type="number" name="stock" placeholder="재고" onChange={handleInputChange} />
      <input type="file" name="image" onChange={handleImageChange} />
      <button onClick={handleSubmit}>제품 등록</button>
    </div>
  );
};

export default SellerDashboard;