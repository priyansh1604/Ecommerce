import React, { useState } from 'react'
import './AddProduct.css'

import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {


  const [image,setImage] = useState(false);
  const [productDetails,setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""

  })


  const imageHandler = (e) => {
    setImage(e.target.files[0]);


  }

  const changeHnadler = (e) => {
    setProductDetails({...productDetails, [e.target.name]:e.target.value})

  }

  const Add_Product = async() => {
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let fromData = new FormData();
    fromData.append('product', image);

    await fetch('https://ecommerce-qbcy.onrender.com/upload',{
      method: 'POST',
      headers:{
        Accept:'application/json',

      },
      body:fromData,
    }).then((resp) => resp.json()).then((data) => {responseData=data})


    if(responseData.success){
      product.image = responseData.image_url;
      console.log(product);

      await fetch('https://ecommerce-qbcy.onrender.com/addproduct',{
        method: 'POST',
        headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(product),
      }).then((resp) => resp.json()).then((data) =>{
        data.success?alert("Product Added"):alert("Failed");  
      })
    }

  }


  return (
    <div className='addproduct'>
      
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHnadler} type="text" name='name' placeholder='Type Here' />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHnadler} type="text" name='old_price' placeholder='Type Here' />
        </div>

        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHnadler} type="text" name='new_price' placeholder='Type Here' />
        </div>
      </div>


      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHnadler} name="category" className='addproduct-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kids</option>
        </select>
      </div>


      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' alt="" />
        </label>

        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>
        
      </div>

      <button onClick={()=>{Add_Product()}} className='addproduct-btn'>
        Add
      </button>

    </div>
  )
}

export default AddProduct
