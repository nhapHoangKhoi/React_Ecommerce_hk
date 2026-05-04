import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ProductItem from "../../components/ProductItem";
import PaginationBar from "../../components/PaginationBar/PaginationBar";

const ProductsByCategory = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  // get page from URL
  const params = new URLSearchParams(location.search);
  const pageFromURL = parseInt(params.get("page") || "1");
  const limit = parseInt(params.get("limit") || "8");

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/products?categoryId=${categoryId}&page=${pageFromURL}&limit=${limit}`
      );
      const data = await response.json();
      if(data.success === true) {
        setProducts(data.data.content);
        setTotalPages(data.data.totalPages);
      }
    };

    fetchProducts();
  }, [categoryId, pageFromURL]);

  const handleChangePage = (newPage) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("page", newPage);
    newParams.set("limit", limit);
    navigate(`${location.pathname}?${newParams.toString()}`);
  };

  return (
    <>
      {products && (
        <div className="tour-domestic">
          <div className="container">
            <h2 className="text-xl font-bold my-4">Category: {products[0]?.category.name}</h2>
            <div className="inner-wrap">
              {products.map((item) => (
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
};

export default ProductsByCategory;