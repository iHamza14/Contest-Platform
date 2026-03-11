import { Routes, Route } from "react-router-dom"

function Home() {
  return <h1>Home</h1>
}

function Problems() {
  return <h1>Problems</h1>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/problems" element={<Problems />} />
    </Routes>
  )
}

export default App