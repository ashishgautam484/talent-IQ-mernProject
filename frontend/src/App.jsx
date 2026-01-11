
import { SignedOut, SignInButton, UserButton, SignedIn, SignOutButton, useUser }from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./Pages/HomePage";

import DashBoardPage from "./Pages/DashBoardPage";
import ProblemPage from "./Pages/ProblemPage";
import ProblemsPage from "./Pages/ProblemsPage";
import SessionPage from "./Pages/SessionPage";

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
      <Route path="/dashboard" element={<DashBoardPage />} />

    
    
      <Route path="/problems" element = {isSignedIn ? <ProblemsPage /> : <Navigate to = {"/"}/>} />
      <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
      <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
    </Routes>

    <Toaster toastOptions={{duration: 3000}}/>
    </>
  );
}

export default App;

//tw, daisyui, react-router, react-hot-toast these are installed and configured
