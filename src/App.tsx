import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import { MainInfoPage } from "./components/MainInfoPage";
import { MovieScheduleSelector } from "./components/MovieScheduleSelectorPage";
import { ReportPage } from "./components/ReportPage";

function App({ properties }: any) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainInfoPage properties={properties} />} />
        <Route path="/select-room" element={<MovieScheduleSelector/>} />
        <Route path="/report" element={<ReportPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
