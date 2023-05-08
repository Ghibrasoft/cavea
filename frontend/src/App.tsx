import { Navigate, Route, Routes } from "react-router-dom";
import { TableComp } from './components/TableComp';
import { AddForm } from './components/AddForm';
import { Container } from "react-bootstrap";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/" element={<TableComp />} />
          <Route path="/addform" element={<AddForm />} />
          <Route path="*" element={<Navigate to='/' />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
