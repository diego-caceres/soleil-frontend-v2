import { BrowserRouter, Routes, Route } from "react-router-dom";

import CodingStart from "../CodingStart";
import CodingVideo from "../CodingVideo";
import CodingLive from "../CodingLive";
import CodingsList from "../CodingsList";
import InterCoder from "../InterCoder";
import EngagementChart from "../EngagementChart";
import { AppBar } from "src/components/AppBar";

const BASE_PATH = "";

export const AppRoutes = () => {
  return (
    <BrowserRouter basePath={BASE_PATH}>
      <AppBar />
      <Routes>
        <Route path={`${BASE_PATH}/`} element={<CodingStart />} />
        <Route path={`${BASE_PATH}/coding-video`} element={<CodingVideo />} />
        <Route path={`${BASE_PATH}/new-coding-live`} element={<CodingLive />} />
        <Route path={`${BASE_PATH}/codings`} element={<CodingsList />} />
        <Route path={`${BASE_PATH}/inter-coder`} element={<InterCoder />} />
        <Route path={`${BASE_PATH}/grafica`} element={<EngagementChart />} />
      </Routes>
    </BrowserRouter>
  );
};
