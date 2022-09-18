import React, { useState } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import { GlobalProvider } from "./context/GlobalState";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/DashboardPage/Dashboard";
import Login from "./pages/LoginPage/Login";
import Api from "./pages/ApiPage/Api";
import Account from "./pages/AccountPage/Account";
import Modal from "./components/Modal/Modal";
import BgRemove from "./pages/app/BgRemove/BgRemove";

function App() {
  const [showModal, setShowModal] = useState(false);
  const flipModal = () => setShowModal(!showModal);

  return (
    <div
      className="App"
      style={{
        backgroundColor: "rgba(240, 240, 240, 0.5)",
        height: "fit-content",
        minHeight: "100vh",
      }}
    >
      <GlobalProvider>
        <BrowserRouter>
          <Modal show={showModal} handleClose={flipModal} />
          <Navbar flipModal={flipModal} />
          <Routes>
            <Route exact path="/" element={<Dashboard ad={true} msg={0} />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/myapi" element={<Api msg={1} demo={4} />} />
            <Route
              exact
              path="/myaccount"
              element={<Account msg={1} demo={4} />}
            />
            <Route exact path="/app/bg-remove" element={<BgRemove />} />
          </Routes>
        </BrowserRouter>
      </GlobalProvider>
    </div>
  );
}

export default App;
