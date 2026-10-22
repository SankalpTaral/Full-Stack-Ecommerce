
const adminAuth = (req,res,next) =>{

    console.log("admin auth");

    const user = req.user;
    if(user.role !=="admin"){
        return res.status(403).json({
        message : "Authenticated But ur not allowed for permissons only admin are allowed"
        })
    }
    // here i come here my role is admin

    req.user = user
   return  next();

}

export default adminAuth;