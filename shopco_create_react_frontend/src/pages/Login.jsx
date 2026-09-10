import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:5000/api/";

export default function Login({signup=false}) {
  const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    async function handleSubmit(event){
        event.preventDefault();
        setError("");
        setLoading(true);
        
        try{
            const response = await fetch(`${API_BASE_URL}auth/${signup?"signup":"login"}`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials: "include",
                body:JSON.stringify({email,password}),
                
            });
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.message || "Login failed!!");
            }
            if (signup) {
              window.alert(data.message || "Account created successfully. Please log in.");
              setEmail("");
              setPassword("");
              navigate("/login", { replace: true });
            } else {
              navigate("/", { replace: true });
            }
        }catch(requestError){
            console.error(`Error: ${requestError}`);
          setError(requestError.message || "Unable to connect to backend");
        }finally{
            setLoading(false);
        }
    }
    

  return (
    <div className="rounded-xl w-screen m-0 bg-[#f0f0f0] p-4 grid place-items-center h-screen overflow-auto">
        
      <div className="auth-box   flex flex-col w-full min-[30rem]:max-w-120 sm:px-8 sm:pt-10 rounded-3xl bg-white shadow-2xl px-4 py-4 text-center">
        <Link to="/" className="auth-box__brand
        font-integral font-bold text-center text-[2.25rem] mb-10">SHOP.CO</Link>

        <h1 className="auth-box__title font-integral text-bold text-2xl text-left">{signup?"Welcome":"Welcome Back"}</h1>
        <p className="auth-box__subtitle font-sans font-light mb-6 text-left text-[#00000099] text-sm">
          Please enter your details to {signup ? "signup" : "login"}.
        </p>

        {error && <p className="auth-box__error text-left text-red-600" role="alert">{error}</p>}

        <form className="auth-form text-left flex flex-col gap-5" id="loginForm" onSubmit={handleSubmit}>
          <div className="auth-form__group flex flex-col gap-2">
            <label htmlFor="emailInput" className="auth-form__label text-black font-sans font-semibold text-sm text-left border-0"
              >Email Address</label>
            <input
              type="email"
              id="emailInput"
              className="auth-form__input px-4 flex py-3 bg-[#f0f0f0] w-full rounded-[4rem]"
              placeholder="user@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              
            />
          </div>

          <div className="auth-form__group flex flex-col gap-2">
            <label htmlFor="passwordInput" className="auth-form__label  text-black font-sans font-semibold text-sm text-left border-0">Password</label>
            <input
              type="password"
              id="passwordInput"
              className="auth-form__input px-4 flex py-3 bg-[#f0f0f0] w-full rounded-[4rem]"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />    
          </div>

          <div className="auth-form__actions flex justify-between">
            <label className="auth-form__checkbox flex gap-1">
              <input type="checkbox" className="auth-form__checkbox-input size-4 align-middle" />
              <span className="auth-form__checkbox-text text-[#00000099] text-sm align-middle ">Remember me</span>
            </label>
            {!signup && <Link to="" className="auth-form__link text-black text-right text-sm font-semibold ">Forgot Password?</Link>}
          </div>

          <button type="submit" disabled={loading} className="auth-form__submit bg-black text-white font-sans w-full py-4 rounded-[4rem] mb-4 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Loading..." : signup ? "Sign Up" : "Log In"}
          </button>
        </form>

        {!signup && <div className="auth-box__footer">
          <p className="auth-box__footer-text text-sm text-[#00000099]">
            Don't have an account?      
            <Link to="/signup" className="auth-box__link text-black font-semibold border-0 bg-transparent">  Sign up</Link>
          </p>
        </div>}
      </div>
    </div>
    );
}
