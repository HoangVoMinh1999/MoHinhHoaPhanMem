exports.cart = (req, res, next) => {
    res.render('shop/cart', { title: 'cart' });
}