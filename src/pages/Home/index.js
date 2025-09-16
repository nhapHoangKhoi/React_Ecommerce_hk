import { useEffect, useState } from "react";
import ProductItem from "../../components/ProductItem";

import { getAllProductsClient } from "../../services/productService";
import PaginationBar from "../../components/PaginationBar/PaginationBar";

import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [listProducts, setListProducts] = useState([]);

  // const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  // Get current page from URL, default to 1
  const params = new URLSearchParams(location.search);
  const pageFromURL = parseInt(params.get("page") || "1");

  // useEffect(() => {
  //   const fetchFeaturedProducts = async () => {
  //     const [featuredRes] = await Promise.all([
  //       // fetch("http://localhost:8080/api/client/products/featured"),
  //     ]);

  //     if (!featuredRes.ok) {
  //       throw new Error("Failed to fetch products");
  //     }

  //     const featuredData = await featuredRes.json();
  //     setFeaturedProducts(featuredData.data);
  //   };

  //   fetchFeaturedProducts();
  // }, []);

  useEffect(() => {
    const fetchAPI = async () => {
      const data = await getAllProductsClient("", pageFromURL);
      // console.log(data);
      if(data.success == true) {
        setListProducts(data.data.content);
        setTotalPages(data.data.totalPages);
      }
    }

    fetchAPI();
  }, [pageFromURL]);

  // console.log(listProducts)

  const handleChangePage = (newPage) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("page", newPage);
    navigate(`${location.pathname}?${newParams.toString()}`);
  };

  return (
    <>
      {featuredProducts && (
        <div className="tour-domestic">
          <div className="container">
            <h2 className="text-xl font-bold my-4">Highlighted Products</h2>
            <div className="inner-wrap">
              {featuredProducts.map((item) => (
                <ProductItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {listProducts && (
        <div className="tour-foreign">
          <div className="container">
            <h2 className="text-xl font-bold my-4 mt-10">Latest Products</h2>
            <div className="inner-wrap">
              {listProducts.map((item) => (
                <ProductItem key={item.id} item={item} />
              ))}
            </div>

            <PaginationBar 
              currentPage={pageFromURL}
              totalPage={totalPages}
              onPageChange={handleChangePage}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Home;