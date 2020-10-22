exports.product_list = (req, res, next) => {
    res.render('shop/product', { title: 'Trang sản phẩm' });
};

exports.product_detail = (req, res, next) => {
    res.render('shop/detail', { title: 'Chi tiết sản phẩm' });
};