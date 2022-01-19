import { BrowserRouter, Routes, Route } from 'react-router-dom'

import CodingStart from './components/CodingStart';
import CodingVideoNew from './components/CodingVideoNew';
import CodingVideo from './components/CodingVideo';
import CodingLive from './components/CodingLive';

const BASE_PATH = '';

function App() {

  return (
    <BrowserRouter basePath={BASE_PATH}>
      <Routes>
        <Route path={`${BASE_PATH}/`} element={<CodingStart />} />
        <Route path={`${BASE_PATH}/new-coding-video`} element={<CodingVideoNew />} />        
        <Route path={`${BASE_PATH}/coding-video`} element={<CodingVideo />} />
        <Route path={`${BASE_PATH}/new-coding-live`} element={<CodingLive />} />
        {/* <Route path={`${BASE_PATH}/workflows/*`} element={<ProjectsIndex />} />
        <Route path={`${BASE_PATH}/templates/*`} element={<TemplatesIndex />} />
        <Route path={`${BASE_PATH}/models/dashboard/*`} element={<ModelsDashboardIndex />} />
        <Route path={`${BASE_PATH}/models/explore/*`} element={<ModelsIndex />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
