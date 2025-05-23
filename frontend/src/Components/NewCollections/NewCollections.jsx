import React, { useEffect, useState } from 'react'
import './NewCollections.css'
// import new_collections from '../Assets/new_collections'
import Item from '../Items/Items'
// import { Collection } from 'mongoose'

const NewCollections = () => {

  const [new_collections,setNew_collection] = useState([]);

  useEffect(() => {
    fetch('https://ecommerce-qbcy.onrender.com/newcollections')
      .then((response) => response.json())  // Add () to invoke the json method
      .then((data) => setNew_collection(data));
  }, []);

  return (
    <div className='new-collections'>
        <h1>NEW COLLECTIONS</h1>
        <hr />
        <div className='collections'>
            {new_collections.map((item,i)=>{
                return <Item key={i} id={item.id} name={item.name} image ={item.image} new_price={item.new_price} old_price={item.old_price}/>

            })}

        </div>
    </div>
  )
}

export default NewCollections
