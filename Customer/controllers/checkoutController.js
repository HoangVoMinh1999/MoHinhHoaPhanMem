exports.checkout = (req, res, next) => {
    res.render('shop/checkout', { title: 'checkout' });
}

exports.confirmation = (req, res, next) => {
    res.render('shop/confirmation', { title: 'confirmation' });
}