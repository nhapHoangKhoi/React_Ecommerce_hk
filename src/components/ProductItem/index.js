import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";

const ProductItem = (props) => {
  const { item } = props;
  return (
    <>
      <div className="product-item">
        <div className="inner-image">
          <Link to={`/product/detail/${item.id}`}>
            {item.productImages?.length > 0 ? (
              <img src={item.productImages[0].imageUrl} alt={item.name} />
            ) : (
              <img src={null} alt={item.name} />
            )}
          </Link>
        </div>

        <div className="inner-content">
          <div className="inner-title">
            <Link to={`/product/detail/${item.id}`}>{item.name}</Link>
          </div>

          <div className="inner-price">
            <div className="inner-price-new">
              {item.price.toLocaleString("en-US")}<span>$</span>
            </div>
          </div>

          <div className="inner-bottom">
            <div className="inner-rating">
              <div className="inner-icon">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <div className="inner-count-rating">
                (<span>15</span>)
              </div>
            </div>
            <div className="inner-remaining-slots">
              <div className="inner-text">Quantity:</div>
              <div className="inner-number">{item.stock}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductItem;