import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";
import Task from "./pages/Task";
import Taskdetail from "./pages/Taskdetail";
import Trash from "./pages/Trash";
import Users from "./pages/Users";

import { Toaster } from "sonner";

function layout() {
  const user = " ";
 
  const location = useLocation();

  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">
        {/* <sidebar/> */}
      </div>

      {/* <mobile sidebar/> */}

      <div className="flex-1 overflow-y-auto">
        {/* <navbar/> */}

        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/Log-in" state={{ from: location }} replace />
  );
}

function App() {
  return (
    <main className="w-full min-h-screen bg-[#f3f4f6]">
      <Routes>
        <Route element={<layout />}>
          <Route path="/" element={<Navigate to="/Dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/task" element={<Task />} />
          <Route path="/completed/:status >" element={<Task />} />
          <Route path="/inprogress/:status >" element={<Task />} />
          <Route path="/todos/:status >" element={<Task />} />

          <Route path="/users" element={<Users />} />
          <Route path="/trashed" element={<Trash />} />
          <Route path="/task:id" element={<Taskdetail />} />
        </Route>

        <Route path="/Log-in" element={<Login />} />
      </Routes>

      <Toaster richColors />
    </main>
  );
}

export default App;
