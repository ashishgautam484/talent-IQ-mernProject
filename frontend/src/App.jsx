import "./App.css";
import { SignedOut, SignInButton, UserButton, SignedIn, SignOutButton }from "@clerk/clerk-react";

function App() {
  return (
    <div>
      <h1>Welcome to the App</h1>

      <SignedOut>
        <SignInButton mode="modal">
          <button >Log In</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <UserButton/>

    </div>
  );
}

export default App;
