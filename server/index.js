const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://rahul1125:rahulvij22@cluster0.mjh1b5r.mongodb.net/e-commerce")


app.get("/", (req,res)=>{
    res.send("Express app is running");
})

//image store engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})


const upload = multer({storage:storage})

//creating upload endppoint for images
app.use("/images", express.static('upload/images'))

app.post("/upload", upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: 0,
            message: "No file uploaded.",
        });
    }

    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`,
    });
});

//schema for creating products

const Product = mongoose.model("Product", {
    id:{
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,

    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    avilable: {
        type: Boolean,
        default: true,
    }


})

app.post("/addproduct", async(req,res)=>{
    let products = await Product.find({});
    let id;

    if(products.length>0){
        let last_prodct_array = products.slice(-1);
        let last_product = last_prodct_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }

    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("saved");
    
    res.json({
        sucess: true,
        name: req.body.name,
    })

})


//creating api for deleting products

app.post("/removeproduct", async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("removed");
    res.json({
        sucess: true,
        name: req.body.name
    })
})



// creating api for getting all products

app.get("/allproducts", async(req,res)=>{
    let products = await Product.find({});
    console.log("fetched");

    res.send(products);
})


//schema for user model

const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type:String,
        unique: true,
    },
    password:{
        type:String,

    },
    cartData:{
        type:Object,
    },
    date:{
        type: Date,
        default: Date.now,
    }

})

//creating for registering the user

app.post("/signup", async(req,res)=>{
    let check = await Users.findOne({email:req.body.email});

    if(check){
        return res.status(400).json({success:false, error:"existing user found with same email id"})
    }

    let cart = {};

    for(let i=0; i<300; i++){
        cart[i]=0;

    }

    const user = new Users({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    }) 

    await user.save();

    const data = {
        user:{
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({success:true, token})
})


//creating endpoint for user login

app.post("/login", async(req,res)=>{
    let user = await Users.findOne({email: req.body.email});

    if(user){
        const passcompare = req.body.password === user.password;

        if(passcompare){
            const data = {
                user:{
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({success:true, token});
        }

        else{
            res.json({success:false, errors:"Wrong password"});
        }
    }
    else{
        res.json({success:false, errors: "Wrong email id"});
    }

    
})


//creating endpoint for new collection

app.get("/newcollections", async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("new collections fetched");
    res.send(newcollection);
})

//creating for poppular in women

app.get("/popularinwomen", async(req,res)=>{
    let products = await Product.find({category:"women"});

    let popular_in_women = products.slice(0,4);
    console.log("popular in women fetched");
    res.send(popular_in_women);
})


//creating middleware to fetch user

const fetchuser = async(req,res,next) => {
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors: "Please authenticate using valid token"});
    }
    else{
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors: "please authenticate using valid token"});
        }
    }
}



//creating for adding in cart
app.post("/addtocart", async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    
    console.log("added", req.body.itemId);
    let userdata = await Users.findOne({ _id: req.user.id });
    userdata.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userdata.cartData });
    res.send("Added");
});

// app.post("/addtocart", async(req,res)=>{
//     // console.log(req.body);
//     console.log("added", req.body.itemId);                   //NOT WOKING

//     let userdata = await Users.findOne({_id:req.user.id});
//     userdata.cartData[req.body.itemId] += 1;
//     await Users.findOneAndUpdate({_id:req.user.id},{cartData:userdata.cartData});
//     res.send("Added");

// })


//creating endpoint to remove product from the cart

app.post("/removefromcart", fetchuser, async(req,res)=>{
    console.log("removed", req.body.itemId);
    let userdata = await Users.findOne({_id:req.user.id});

    if(userdata.cartData[req.body.itemId]>0)
    userdata.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userdata.cartData});
    res.send("removed");

})


//creating endpoint to get cart data

app.get("/getcart", fetchuser, async(req,res)=>{
    console.log("getcart");

    let userdata = await Users.findOne({_id:req.body.id});
    res.json(userdata.cartData);
})


app.listen(port,(error)=>{
    if(!error){
        console.log("server running on port"+port);
    }
    else{
        console.log("error : " + error);
    }

})

