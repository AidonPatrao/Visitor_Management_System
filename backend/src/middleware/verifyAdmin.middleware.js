export const verifyAdmin =  (req,res,next)=> {
    try {
        if(req.user.role !== 'ADMIN'){
        return res.status(403).json({message:"you don't have access to this resource"})
    }

    next()
    } catch (error) {
        return res.status(500).json({message:"internal server error"})
    }
}