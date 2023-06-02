import { BrowserRouter, Routes, Route } from "react-router-dom";

import CodingStart from "../CodingStart";
import CodingVideo from "../CodingVideo";
import CodingLive from "../CodingLive";

const BASE_PATH = "";

export const AppRoutes = () => {
  return (
    <BrowserRouter basePath={BASE_PATH}>
      <Routes>
        <Route path={`${BASE_PATH}/`} element={<CodingStart />} />
        <Route path={`${BASE_PATH}/coding-video`} element={<CodingVideo />} />
        <Route path={`${BASE_PATH}/new-coding-live`} element={<CodingLive />} />
      </Routes>
    </BrowserRouter>
  );
};
