import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import Footer from "./components/Footer";
import { MainInfoPage } from "./components/MainInfoPage";
import { MovieScheduleSelector } from "./components/MovieScheduleSelectorPage";
import { ReportPage } from "./components/ReportPage";
import Reservations from "./components/Reservations";

function App({ properties }: any) {
  return (
    <Router>
      <div className="app-container">
      <Routes>
        <Route path="/" element={<MainInfoPage properties={properties} />} />
        <Route path="/select-room" element={<MovieScheduleSelector/>} />
        <Route path="/report" element={<ReportPage/>} />
        <Route path="/reservations" element={<Reservations/>} />
      </Routes>
      <Footer />
      </div>
    </Router>
  );
}

export default App;
