import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams(); // get product id from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [theUser, setTheUser] = useState(null);

  // rating form state
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/users/me", {
          method: "GET",
          credentials: "include"
        });
        const data = await response.json();

        if(data.success === true) {
          setTheUser(data.data);
        }
      } 
      catch (error) {
        setTheUser(null);
      }
    };

    fetchLoggedInUser();
  }, []);

  const handleSubmitRating = async () => {
    if(!ratingValue) {
      alert("Please select a rating.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:8080/api/v1/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ratingValue,
          comment: "",
          userId: theUser.id,
          productId: product.id,
        }),
      });

      const data = await response.json();
      if(data.success === true) {
        alert("Thanks for your rating!");
        setRatingValue(0);
        setComment("");
      }
    } 
    catch (error) {
      console.error("Rating error:", error);
      alert("Error submitting rating");
    } 
    finally {
      setSubmitting(false);
    }
  };

  if(loading) {
    return <div>Loading...</div>;
  }

  if(!product) {
    return <div>Product not found!</div>;
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating); // whole stars
    const hasHalfStar = rating % 1 >= 0.5; // half star?
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} />);
    }

    return stars;
  };

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
            <div className="sticky-wrapper">
              <div className="box-tour-detail">
                <div className="inner-title-main">{product.name}</div>
                <div className="inner-product">
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
                  <div className="inner-info">
                    <div className="inner-rating">
                      <div className="inner-stars">
                        {/* <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar /> */}
                        {renderStars(product.avgRating)}
                      </div>
                    </div>
                    <div className="inner-number">
                      <span>{product.ratingCount}</span> ratings
                    </div>
                  </div>
                </div>
                <div className="inner-meta">
                  <div className="inner-item">
                    <span>Price: </span>
                    <span className="inner-highlight">{product.price.toLocaleString("en-US")}$</span>
                  </div>
                  <div className="inner-item">
                    <span>Available: </span>
                    <span className="inner-highlight">{product.stock}</span>
                  </div>
                </div>
                <div className="inner-form">
                  <div className="button button-highlight inner-button-add-cart">
                    Add To Cart
                  </div>
                </div>
              </div>
            </div>

            {/* --- Rating Box --- */}
            {theUser ? (
              <div className="rating-box">
                <h3 className="rating-title">Rate this product</h3>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star-icon ${star <= ratingValue ? "active" : ""}`}
                      onClick={() => setRatingValue(star)}
                    />
                  ))}
                </div>
                {/* <textarea
                  className="rating-comment"
                  rows="3"
                  placeholder="Leave a comment (optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                /> */}
                <button
                  className="button button-highlight inner-button-add-cart"
                  onClick={handleSubmitRating}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Rating"}
                </button>
              </div>
            ) : (
              <p className="login-prompt">
                <a href="/login">Log in</a> to rate this product.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;