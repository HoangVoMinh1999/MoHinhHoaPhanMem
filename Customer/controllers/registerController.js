exports.register = (req, res, next) => {
    res.render('users/register', { title: 'register' });
}