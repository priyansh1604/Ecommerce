import React, { useEffect, useState } from 'react'
import './ListProduct.css'

import cross_icon from '../../assets/cross_icon.png'

const ListProduct = () => {

  const [allproducts,setAllproducts] = useState([]);

  const fetchinfo = async() => {
    await fetch('https://ecommerce-qbcy.onrender.com/allproducts')
    .then((res)=>res.json())
    .then((data)=>{setAllproducts(data)});
  }

  useEffect(()=>{
    fetchinfo();

  },[])


 //removing product

const remove_product = async(id) => {
  await fetch('https://ecommerce-qbcy.onrender.com/removeproduct', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body:JSON.stringify({id:id})
  })
  await fetchinfo();
}


  return (
    <div className='listproduct'>

      <h1>All Products List</h1>

      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      <div className="listproduct-allproduct">
        <hr />

        {allproducts.map((product,index)=>{
          return <React.Fragment key={product.id}>
          <div key={index} className="listproduct-format-main listproduct-format">

            <img src={product.image} className='listproduct-product-icon' alt="" />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>

            <img onClick={()=>{remove_product(product.id)}} src={cross_icon} className='listproduct-remove-icon' alt="" />
          </div>
          <hr />
          </React.Fragment>

          
        })}

      </div>
      
    </div>
  )
}

export default ListProduct
