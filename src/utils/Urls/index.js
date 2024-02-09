const url="api/v1";
const apiUrls={
    registerUser:`${url}/create-user`,
    loginUser:`${url}/user-login`,
    getAllUsers:`${url}/get-users`,
    deleteUser:`${url}/user`,
    disableUser:`${url}/disable-user`,
    getUser:`${url}/user`,
    updateUser:`${url}/update-user`,
    getUserProfile:`${url}/get-profile`,
    addProduct:`${url}/products/new-products`,
    showProduct:`${url}/products`,
    addToCart:`${url}/add-to-cart`,
    getCartItems:`${url}/get-cart-items`,
    removeProductFromCart:`${url}/remove-from-cart`,
    updateToCart:`${url}/update-to-cart`,
    checkoutSession:`${url}/start-checkout-session`,
    checkoutSuccess:`${url}/checkout-order-success`,
    checkoutFailure:`${url}/checkout-order-failure`,
    successfullOrders:`${url}/buy-order-list`,
    creatorsProduct:`${url}/creators-product`,

  
}


export default apiUrls;







