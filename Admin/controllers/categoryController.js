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
exports.add_category = (req, res, next) => {
    let name = req.body.name;
    console.log(name);
    Category.find({ name: name }, function(err, category) {
        if (err) return next(err);
        if (!category) {
            console.log(category);
            res.redirect('back');
        } else {
            let newCategory = new Category({
                name: name
            });
            newCategory.save();
            res.redirect('back');
        }
    })
}
exports.edit_category = (req, res, next) => {
    let id = req.params.id;
    let name = req.body.name;
    Category.findOne({ _id: id }, function(err, category) {
        if (!category) {
            res.redirect('back');
        } else {
            category.name = name;
            category.save();
            res.redirect('back');
        }
    })
}