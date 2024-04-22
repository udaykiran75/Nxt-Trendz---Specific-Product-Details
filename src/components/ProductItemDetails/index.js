import './index.css'
import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogres: 'INPROGRES',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstant.initial,
    quantity: 1,
    productDetails: {},
    similarProductsList: [],
  }

  componentDidMount() {
    this.productItemDetails()
  }

  productItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstant.inprogres})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const productData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
      }
      const similarProductsData = data.similar_products.map(product => ({
        id: product.id,
        imageUrl: product.image_url,
        title: product.title,
        style: product.style,
        price: product.price,
        description: product.description,
        brand: product.brand,
        tatalReviews: product.total_reviews,
        rating: product.rating,
        availability: product.availability,
      }))
      this.setState({
        productDetails: productData,
        similarProductsList: similarProductsData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  productsItemView = () => {
    const {productDetails, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productDetails
    return (
      <div className="products-main-container">
        <div className="product-item-div">
          <img src={imageUrl} className="product-image" alt="product" />
          <div>
            <h1 className="product-name">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-review-div">
              <button className="rating-btn" type="button">
                <p className="rating-no">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </button>
              <p className="total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="discription">{description}</p>
            <div className="paras-con">
              <p className="name">Availability: </p>
              <p className="value">{availability}</p>
            </div>
            <div className="paras-con">
              <p className="name">Brand: </p>
              <p className="value">{brand}</p>
            </div>
            <hr className="horizantal-line" />
            <div className="quantity-container">
              <button
                onClick={this.onDecreseQuantity}
                className="qnty-button"
                aria-label="Decrease Quantity"
                data-testid="minus"
                type="button"
              >
                <BsDashSquare className="quantity-controller-icon" />
              </button>
              <p>{quantity}</p>
              <button
                onClick={this.onIncreseQuantity}
                className="qnty-button"
                aria-label="Increase Quantity"
                data-testid="plus"
                type="button"
              >
                <BsPlusSquare className="quantity-controller-icon" />
              </button>
            </div>
            <button className="add-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.similarProductsView()}
      </div>
    )
  }

  onDecreseQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncreseQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  loadingview = () => (
    <div className="container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  continueShoppingBtn = () => {
    const {history} = this.props
    history.replace('/products')
  }

  failureView = () => (
    <div className="container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <button className="continue-button" onClick={this.continueShoppingBtn}>
        Continue Shopping
      </button>
    </div>
  )

  similarProductsView = () => {
    const {similarProductsList} = this.state

    return (
      <div className="similar-product-container">
        <h1 className="spd-heading">Similar Products</h1>
        <ul className="similar-produts-list">
          {similarProductsList.map(itemDetails => (
            <SimilarProductItem
              productDetail={itemDetails}
              key={itemDetails.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderingApiStatusViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.productsItemView()
      case apiStatusConstant.inprogres:
        return this.loadingview()
      case apiStatusConstant.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderingApiStatusViews()}
      </div>
    )
  }
}
export default withRouter(ProductItemDetails)
