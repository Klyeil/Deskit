import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ProductEditPage.css";

const ProductEditPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    company: "",
    category: "",
    description: "",
    stock: "",
    image: null,
  });
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const isEditing = Boolean(productId);

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
    fetchOptions();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/products/${productId}`
      );
      setProductData(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchOptions = async () => {
    try {
      const [companyResponse, categoryResponse] = await Promise.all([
        axios.get("http://localhost:3001/companies/list"),
        axios.get("http://localhost:3001/categories/list"),
      ]);
      setCompanies(companyResponse.data);
      setCategories(categoryResponse.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };

  const handleSave = async () => {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:3001/products/${productId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("제품이 성공적으로 수정되었습니다!");
      } else {
        await axios.post("http://localhost:3001/products/add", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("제품이 성공적으로 추가되었습니다!");
      }
      navigate("/seller");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("제품 저장에 실패했습니다.");
    }
  };

  return (
    <div className="product-edit-page">
      <h1>{isEditing ? "제품 수정" : "제품 추가"}</h1>
      <input
        type="text"
        name="name"
        placeholder="제품명"
        value={productData.name}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="price"
        placeholder="가격"
        value={productData.price}
        onChange={handleInputChange}
      />
      <select
        name="company"
        value={productData.company}
        onChange={handleInputChange}
      >
        <option value="">회사를 선택하세요</option>
        {companies.map((company) => (
          <option key={company._id} value={company._id}>
            {company.name}
          </option>
        ))}
      </select>
      <select
        name="category"
        value={productData.category}
        onChange={handleInputChange}
      >
        <option value="">카테고리를 선택하세요</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <textarea
        name="description"
        placeholder="제품 설명"
        value={productData.description}
        onChange={handleInputChange}
      ></textarea>
      <input
        type="number"
        name="stock"
        placeholder="재고"
        value={productData.stock}
        onChange={handleInputChange}
      />
      <input type="file" name="image" onChange={handleImageChange} />
      <button onClick={handleSave}>저장</button>
    </div>
  );
};

export default ProductEditPage;