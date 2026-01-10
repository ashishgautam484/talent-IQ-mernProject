
import { SignedOut, SignInButton, UserButton, SignedIn, SignOutButton, useUser }from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./Pages/HomePage";
import ProblemPage from "./Pages/ProblemPage";
import { use } from "react";
import { Toaster } from "react-hot-toast";

function App() {

  const {isSignedIn} = useUser()
  return (
    <>  
    <Routes>
    
      <Route path="/" element = {<HomePage />}/> 
      
      <Route path="/problems" element = {isSignedIn ? <ProblemPage /> : <Navigate to = {"/"}/>} />
    </Routes>

    <Toaster toastOptions={{duration: 3000}}/>
    </>
  );
}

export default App;

//tw, daisyui, react-router, react-hot-toast these are installed and configured
