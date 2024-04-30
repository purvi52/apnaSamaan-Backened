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
    token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MmY3MzIwZjI1NmJmOWUxNzY0MGI3YiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE0Mzg1Njk2fQ.Cvq6xAhFVQRRju4ZVolJZ4uhzZlkcBrJBBsKS6XmmMA"
    return token;
}