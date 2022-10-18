import  Express  from "express";
import BlogsModel from "./model.js";
import createHttpError from "http-errors";






const blogRouter = Express.Router()



blogRouter.post("/",async (req,res,next)=>{
    try{
        const newUser = new BlogsModel(req.body)
        const {_id} = await newUser.save()

        res.status(201).send({_id})
        
    }catch(error){
        next(error)
    }

})

blogRouter.get("/", async(req,res,next)=>{
    try{
        const users = await BlogsModel.find()
        res.send(users)

    }catch(error){
        next(error)
    }
})
blogRouter.get("/:userId", async(req,res,next)=>{
    try{
        const user = await BlogsModel.findById(req.params.userId)
        if(user){
            res.send(user)
        }
        else{
            next(createHttpError(404,`user with id ${req.params.userId} not found`))
        }
    } catch(error){
        next(error)
    }

})
blogRouter.put("/:userId",async(req,res,next)=>{
    try{
        const updateUser = await BlogsModel.findByIdAndUpdate(
            req.params.userId,req.body,
            {new: true, runValidators: true}
            )
            if(updateUser){
                res.send(updateUser)
            }
            else{
                next(createHttpError(404,`user with id ${req.params.userId} didnt found`))
            }
    } catch(error){
        next(error)
    }

})
blogRouter.delete("/:userId",async(req,res,next)=>{
    try{
        const deleteuser = await BlogsModel.findByIdAndDelete(req.params.userId)
        if(deleteuser){
            res.status(204).send()
        } else{
            next(createHttpError(404,`user with id ${req.params.userId} didnt found`))
        }
    } catch(error){
        next(error)
    }

})

export default blogRouter