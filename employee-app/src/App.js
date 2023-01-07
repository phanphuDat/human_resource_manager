import './App.css';
import UserHome from './pages/Users/UserHome';
import { Route, Routes } from "react-router-dom";
import NotFound from './pages/NotFound/NotFound';
import Orthers from './pages/Users/Orthers';
import Chats from './pages/Share/Chats';
import Statisticals from './pages/Users/Statisticals';
import News from './pages/Share/News';
import Infors from './pages/Share/Infors';
import WorkSchedules from './pages/Share/WorkSchedules';
import MySchedules from './pages/Users/WorkSchedule/MySchedules';
import DayOff from './pages/Users/WorkSchedule/DayOff';
import Login from "./pages/Auth/Login";
import ResetLogin from "./pages/Auth/ResetLogin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterSchedule from './pages/Users/WorkSchedule/RegisterSchedule';
import ResetPassword from './pages/Auth/ResetPassword';

import io from "socket.io-client";
const socket = io.connect(process.env.REACT_APP_SOCKET_ENDPOINT);

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/resetPass" element={<ResetLogin />} />
        <Route path="/passwordReset" element={<ResetPassword />} />
        <Route path="/employee" element={<UserHome />}>
          <Route path="infors" element={<Infors />} />
          <Route index element={<News />} />
          <Route path="workschedules" element={<WorkSchedules />} />
          <Route path="myworkschedules" element={<MySchedules socket={socket}/>} />
          <Route path="registerschedules" element={<RegisterSchedule />} />
          <Route path="dayoffs" element={<DayOff />} />
          <Route path="statisticals" element={<Statisticals />} />
          <Route path="chats" element={<Chats socket={socket}/>} />
          <Route path="orthers" element={<Orthers />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-center" />
    </div>
  )
}

export default App;
