import "./App.css";
import moment from "moment";
import AdminHome from "./pages/Admin/AdminHome";
import Login from "./pages/Auth/Login";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound/NotFound";
import Orthers from "./pages/Admin/Orthers";
import Chats from "./pages/Share/Chats";
import News from "./pages/Share/News";
import Salarys from "./pages/Admin/Statisticals/Salarys";
import Postions from "./pages/Admin/Store/Position";
import Department from "./pages/Admin/Store/Department";
import BonusPunish from "./pages/Admin/Store/BonusPunish";
import CreateSchedules from "./pages/Admin/ManagerWorks/CreateSchedules";
import DayOff from "./pages/Admin/ManagerWorks/DayOff";
import InOut from "./pages/Admin/ManagerWorks/InOut";
import WorkSchedules from "./pages/Share/WorkSchedules";
import ManagerUser from "./pages/Admin/Store/ManagerUser";
import Infor from "./pages/Share/Infors";
import Timekeeping from "./pages/Admin/Statisticals/Timekeeping";
import QrCode from "./pages/Admin/ManagerWorks/QrCode";
import io from "socket.io-client";

moment.locale("vi");
const socket = io.connect(process.env.REACT_APP_SOCKET_ENDPOINT);

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/manager" element={<AdminHome />}>
          <Route path="infors" element={<Infor />} />
          <Route index element={<News />} />
          <Route path="managerusers" element={<ManagerUser />} />
          <Route>
            <Route
              path="managerworks/workschedules"
              element={<WorkSchedules />}
            />
            <Route path="managerworks/inout" element={<InOut />} />
            <Route
              path="managerworks/createschedules"
              element={<CreateSchedules />}
            />
            <Route path="managerworks/dayoff" element={<DayOff />} />
          </Route>
          <Route>
            <Route path="managerworks/bonuspunish" element={<BonusPunish />} />
            <Route path="store/departments" element={<Department />} />
            <Route path="store/positions" element={<Postions />} />
          </Route>
          <Route path="statisticals/salarys" element={<Salarys />} />
          <Route path="statisticals/timekeeping" element={<Timekeeping />} />
          <Route path="chats" element={<Chats socket={socket} />} />
          <Route path="orthers" element={<Orthers />} />
          <Route path="qrCode" element={<QrCode socket={socket}/>} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
