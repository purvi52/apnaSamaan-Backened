const passport = require('passport');

exports.isAuth = (req, res, done) => {
  return passport.authenticate('jwt')
};

exports.sanitizeUser = (user)=>{
    return {id:user.id, role:user.role}
}

exports.cookieExtractor=function(req)
{
    let token=null;
    if(req && req.cookies)
    {
        token=req.cookies['jwt'];
        
    }
    token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzBkNDRhOTViNDNkYTllYzcxY2JjOSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxNDkxODIyOX0.Qqer2MyvyfzKJKApOSO13jS7Qvr_S6HYpq_jesMLePs";
    return token;
};