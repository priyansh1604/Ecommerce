import React, { useState } from 'react'
import './CSS/Loginsignup.css'

const Loginsignup = () => {

  const [state,setState] = useState("Login");
  const [formdata,setFormdata] = useState({
    username:"",
    password:"",
    email:""
  })

  const changehandler= (e) => {
    setFormdata({...formdata,[e.target.name]:e.target.value})

  }


  //login
  const login = async() => {
    console.log("login executed", formdata);

    let responsedata;
    await fetch('https://ecommerce-qbcy.onrender.com/login',{
      method: 'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formdata),
    }).then((response) => response.json()).then((data)=>responsedata=data)

    if(responsedata.success){
      localStorage.setItem('auth-token',responsedata.token);
      window.location.replace("/");
    }
    else{
      alert(responsedata.errors)
    }

  }


  //signup
  const signup = async() => {
    console.log("signup executed", formdata);

    let responsedata;
    await fetch('https://ecommerce-qbcy.onrender.com/signup',{
      method: 'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formdata),
    }).then((response) => response.json()).then((data)=>responsedata=data)

    if(responsedata.success){
      localStorage.setItem('auth-token',responsedata.token);
      window.location.replace("/");
    }
    else{
      alert(responsedata.errors)
    }
  }

  return (
    <div className='loginsignup'>
        <div className="loginsignup-container">
            <h1>{state}</h1>
            <div className="loginsignup-fields">
                {state==="Sign up"?<input name='username' value={formdata.username} onChange={changehandler} type="text" placeholder='Your name' />:<></>}
                <input name='email' value={formdata.email} onChange={changehandler} type="email" placeholder='email-address'/>
                <input name='password' value={formdata.password} onChange={changehandler} type="password" placeholder='password' />
            </div>
            <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
            {state === "Sign up"
            ?<p className='loginsignup-login'>Already have an account ?<span onClick={()=>{setState("Login")}}>Login here</span></p>
            :<p className='loginsignup-login'>Create an account ?<span onClick={()=>{setState("Sign up")}}>Click here</span></p>
            }


            <div className="loginsignup-agree">
                <input type="checkbox" name='' id='' />
                <p>By continuing, I agree to the Terms of use & Privay Policy.</p>
            </div>
        </div>
      
    </div>
  )
}

export default Loginsignup
