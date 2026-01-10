
import { SignedOut, SignInButton, UserButton, SignedIn, SignOutButton, useUser }from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./Pages/HomePage";
import ProblemPage from "./Pages/ProblemPage";
import DashBoardPage from "./Pages/DashBoardPage";
import { use } from "react";
import { Toaster } from "react-hot-toast";

function App() {

  const {isSignedIn, isLoaded} = useUser()

  // if flickering occurs
  if (!isLoaded) return null;

  return (
    <>  
    <Routes>
    
      <Route path="/" element = {!isSignedIn ? <HomePage /> : <Navigate to = {"/dashboard"}/>}/>
      <Route path="/dashboard" element = {isSignedIn ? <DashBoardPage /> : <Navigate to = {"/"}/>}/>
    
    
      <Route path="/problems" element = {isSignedIn ? <ProblemPage /> : <Navigate to = {"/"}/>} />
    </Routes>

    <Toaster toastOptions={{duration: 3000}}/>
    </>
  );
}

export default App;

//tw, daisyui, react-router, react-hot-toast these are installed and configured
