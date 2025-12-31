import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then(res => res.json())
      .then(data => {
        console.log("Backend response:", data);
      })
      .catch(err => {
        console.error("Error calling backend:", err);
      });
  }, []);

  return (
    <div>
      <h1>Frontend is live</h1>
    </div>
  );
}

export default App;
