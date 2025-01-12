import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SellerDashBoard.css";

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/products/list");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:3001/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("제품이 성공적으로 삭제되었습니다!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("제품 삭제에 실패했습니다.");
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/seller/edit/${productId}`); // 제품 수정 페이지로 이동
  };

  const handleAddProduct = () => {
    navigate("/seller/add"); // 제품 추가 페이지로 이동
  };

  return (
    <div className="seller-dashboard">
      <h1>판매자 대시보드</h1>
      <button onClick={handleAddProduct} className="add-product-btn">
        + 제품 추가
      </button>
      <table>
        <thead>
          <tr>
            <th>제품명</th>
            <th>가격</th>
            <th>재고</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>₩{product.price.toLocaleString()}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => handleEditProduct(product._id)}>
                  수정
                </button>
              </td>
              <td>
                <button onClick={() => handleDelete(product._id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerDashboard;