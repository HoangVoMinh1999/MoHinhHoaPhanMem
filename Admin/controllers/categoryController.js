var Category = require('../models/Category');

exports.category_list = (req, res, next) => {
    let page = Number(req.query.page) || Number(1);
    Category.find({}).lean().exec(function(err, list_categories) {
        if (err) return next(err);
        var listCategoriesInOnePage = [],
            page_number = [];
        for (let i = 0; i < list_categories.length; i++) {
            if (Math.floor(i / 4) == page - 1) {
                var data = list_categories[i];
                data['number'] = i + 1;
                listCategoriesInOnePage.push(data);
            }
            if (i / 4 == Math.floor(i / 4)) {
                page_number.push((i / 4) + 1);
            }
        }
        res.render('categories/category-list', {
            currentPage: page,
            page_number: page_number,
            listCategoriesInOnePage: listCategoriesInOnePage,
            layout: 'Index_Layout'
        });
    })
}