import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa6";

const ProductDetails = () => {
  const { id } = useParams(); // get product id from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/products/${id}`);
        const data = await response.json();

        if(data.success === true) {
          setProduct(data.data);
        }
      }
      catch (error) {
        console.error("Failed to fetch product:", error);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if(loading) {
    return <div>Loading...</div>;
  }

  if(!product) {
    return <div>Product not found!</div>;
  }

  return (
    <div className="section-ten">
      <div className="container">
        <div className="inner-wrap">
          {/* LEFT SIDE */}
          <div className="inner-left">
            <div className="box-images">
              <div className="inner-images-main">
                {/* Main thumbnail */}
                {product.productImages?.length > 0 ? (
                  <div className="inner-image">
                    <img
                      src={product.productImages[0].imageUrl}
                      alt={product.name}
                    />
                  </div>
                ) : (
                  <div className="inner-image">
                    <img src={null} alt={product.name} />
                  </div>
                )}
              </div>
            </div>
            <div className="box-tour-info">
              <div className="inner-title">Product Description</div>
              <div className={`inner-content ${showAll ? "expanded" : "collapsed"}`}>
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
              <div className="inner-read-more">
                <button 
                  className="button button-outline-highlight"
                  onClick={() => setShowAll((prev) => !prev)}
                >
                  {showAll ? "Show less" : "Show all"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="inner-right">
            <div className="box-tour-detail">
              <div className="inner-title-main">{product.name}</div>
              <div className="inner-product">
                <div className="inner-image">
                  <img
                    src={product.productImages[0].imageUrl}
                    alt={product.name}
                  />
                </div>
                <div className="inner-info">
                  <div className="inner-rating">
                    <div className="inner-stars">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                  </div>
                  <div className="inner-number">
                    <span>500</span> ratings
                  </div>
                </div>
              </div>
              <div className="inner-category">
                Category: <strong>{product.category?.name}</strong>
              </div>
              <div className="inner-price">
                Price: <strong>{product.price.toLocaleString("en-US")}$</strong>
              </div>
              <div className="inner-stock">
                Quantity: <strong>{product.stock}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;