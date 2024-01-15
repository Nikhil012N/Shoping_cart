

module.exports=function(req,res,next){
    const {name,category,quantity,description,thumbnail,images}=req.body;
    if(!name || !category || !quantity || !description ){
        return res.json({error:"please fill all feilds"})
    }
    next();
}