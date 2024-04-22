import './index.css'

const SimilarProductItem = props => {
  const {productDetail} = props
  const {imageUrl, title, price, brand, rating} = productDetail
  return (
    <li className="list-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="pds-image"
      />
      <h1 className="pds-name">{title}</h1>
      <p className="pds-brand">by {brand}</p>
      <div className="rating-review-con">
        <p className="price">Rs {price}/-</p>
        <button className="rating-bton" type="button">
          <p className="rating-no">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </button>
      </div>
    </li>
  )
}
export default SimilarProductItem
