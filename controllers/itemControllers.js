//const { default: items } = require('razorpay/dist/types/items');
const Item = require('../models/Item');
const asyncHandler = require('express-async-handler');

module.exports.getItems = asyncHandler(async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

module.exports.setItem=asyncHandler(async(req,res)=>{
  const {title,description,img,price}=req.body
  try{
    await Item.create({title,description,img,price})
    res.json('added')
  }
  catch(e){
    res.json(e)
  }

})

module.exports.UpdateItems=asyncHandler(async(req,res)=>{
  const id= req.params.id
  const{img,title,description,price}=req.body
  try{
      const user=await Item.findById(id)
      if(!user){
        res.status(400).json('wrong id')
      }
      user.img=img
      user.title=title
      user.description=description
      user.price=price
      user.save()
      res.json('updated')
  }catch(err){
    res.status(400).json({"status":"failed","message":err})
  }
})

module.exports.DeleteItems=asyncHandler(async(req,res)=>{
  const id= req.params.id
  try{
      await Item.findByIdAndDelete(id)
      res.json('Deleted')
  }catch(err){
    res.status(400).json({"status":"failed","message":err})
  }
})
