import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import { IoMdAdd } from "react-icons/io";
import Button from "../components/Button"
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import {tasks} from "../assets/data"
import Boardview from "../components/Boardview";
import Table from "../components/task/Table";


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

  const [selected, setselected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const status = params?.status || "";

  return loading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && (
          <Button
            label="Create Task"
            icon={<IoMdAdd className="text-lg " />}
            className="flex flex-row reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>


      <div>
        <Tabs tabs={TABS} setselected={setselected}>
        {!status &&(
          <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
            <TaskTitle label="ToDo " className={TASK_TYPE.todo}/>
            <TaskTitle label="InProgress " className={TASK_TYPE.inProgress}/>
            <TaskTitle label=" completed " className={TASK_TYPE.completed}/>
          </div>
        )}

        {
          selected===0?<Boardview tasks={tasks}/>:<div>
            <Table
            tasks={tasks}/>
          </div>
        }
        </Tabs>  
      </div>
    </div>
  );
};

export default Task;
