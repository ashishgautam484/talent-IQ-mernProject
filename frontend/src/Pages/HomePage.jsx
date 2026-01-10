import React from 'react'
import { SignedOut, SignInButton, UserButton, SignedIn, SignOutButton }from "@clerk/clerk-react";
import toast from 'react-hot-toast';
function HomePage() {
  return (
    <div>
      <button className='btn btn-secondary'
       onClick={() => toast.success("Welcome to Talent IQ!") }
      >Click me</button>

      <SignedOut>
        <SignInButton mode="modal">
          <button >Login</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton>
          <button>Logout</button>
        </SignOutButton>
      </SignedIn>

      <UserButton/>

    </div>
  )
}

export default HomePage