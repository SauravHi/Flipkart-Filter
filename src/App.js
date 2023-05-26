import React, { useState, useEffect } from "react";
import axios from "axios";

const DATA_API_URL = "https://jsonblob.com/api/1111502705150672896";

export default function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: Infinity,
    brand: ""
  });
  const [priceFilterMin] = useState([
    0,
    500,
    1000,
    1500,
    2000,
    2500
  ]);
  const [priceFilterMax] = useState([
    500,
    1000,
    1500,
    2000,
    2500,
    3000,
    3500,
    4000,
    4500,
    5000,
    5500,
    6000,
    6500
  ]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(DATA_API_URL);
      const fetchedProducts = response.data.products;
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handlePriceMinChange = (event) => {
    const priceMin = parseInt(event.target.value);
    setFilters({ ...filters, priceMin });
  };

  const handlePriceMaxChange = (event) => {
    const priceMax = parseInt(event.target.value);
    setFilters({ ...filters, priceMax });
  };

  const handleBrandChange = (event) => {
    const brand = event.target.value;
    setFilters({ ...filters, brand });
  };

  useEffect(() => {
    const { priceMin, priceMax, brand } = filters;
    const filtered = products.filter((product) => {
      const passPrice = product.price >= priceMin && product.price <= priceMax;
      const passBrand = product.brand
        .toLowerCase()
        .includes(brand.toLowerCase());
      return passPrice && passBrand;
    });
    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleSortChange = (event) => {
    const sortType = event.target.value;
    if (sortType === "priceAsc") {
      const sorted = [...filteredProducts].sort((a, b) => a.price - b.price);
      setFilteredProducts(sorted);
    } else if (sortType === "priceDesc") {
      const sorted = [...filteredProducts].sort((a, b) => b.price - a.price);
      setFilteredProducts(sorted);
    } else if (sortType === "relevance") {
      setFilteredProducts(products);
    }
  };

  return (
    <div>
      <div>
        <h2>Filters</h2>
        <label>Price Range:</label>
        <select value={filters.priceMin} onChange={handlePriceMinChange}>
          {priceFilterMin.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select value={filters.priceMax} onChange={handlePriceMaxChange}>
          {priceFilterMax.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <br />
        <label>Brand:</label>
        <input type="text" value={filters.brand} onChange={handleBrandChange} />
      </div>
      <div>
        <h2>Sort</h2>
        <label>Sort By:</label>
        <select onChange={handleSortChange}>
          <option value="relevance">Relevance</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
      </div>
      <div >
        <h2>Product Grid</h2>
        {filteredProducts.length > 0 ? (
          <div>
            <p>Showing {filteredProducts.length} products</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  <div style={{ width: "120px", background: "#F4F4F4" }}>
                    <img style={{ width: "100px" }} src={product.images[0]} alt={product.title} />
                    <h3>{product.title}</h3>
                    <p>Rating: {product.rating}</p>
                    <p>Price: {product.price}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};
