import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useLocation, useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import { IoMdAdd } from "react-icons/io";
import Button from "../components/Button";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import { tasks } from "../assets/data";
import Boardview from "../components/Boardview";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { useGetAllTaskQuery } from "../redux/slices/apis/taskApiSlice";
// import AddSubTask from "../components/task/AddSubTask";
// import AddUser from "../components/AddUser";

const TABS = [
  {
    title: "Board View ",
    icon: <MdGridView />,
  },
  {
    title: "List View ",
    icon: <FaList />,
  },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  inProgress: "bg-yellow-600",
  completed: "bg-green-600",
};

const Task = () => {
  const params = useParams();
  const location = useLocation();
  // console.log("Current Path:", location.pathname);
  // console.log("Route Params:", params);
  // console.log("Route Params:", params);

  const [selected, setselected] = useState(0);
  const [open, setOpen] = useState(false);
  // const [loading, setLoading] = useState(false);

  const status = params?.status || "";


  // console.log("data query se fecth krne se pehle ")

  const { data, isLoading ,error} = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: "",
  });
  
 
  // console.log("data", data);
// console.log("error", error);
  // console.log("Status:", status);

  return isLoading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      {/* <div>
      <h1>Task Page</h1>
      <p>Current Status: {params.status}</p>
      
    </div> */}
      <div className="flex justify-between items-center mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg " />}
            className="flex flex-row reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <div>
        <Tabs tabs={TABS} setselected={setselected}>
          {!status && (
            <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
              <TaskTitle label="ToDo " className={TASK_TYPE.todo} />
              <TaskTitle label="In Progress " className={TASK_TYPE["in progress"]} />
              <TaskTitle label="completed " className={TASK_TYPE.completed} />
            </div>
          )}

          {selected === 0 ? (
            <Boardview tasks={data?.tasks} />
          ) : (
            <div className="w-full">
              <Table tasks={data?.tasks} />
            </div>
          )}
        </Tabs>

        <AddTask open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default Task;
