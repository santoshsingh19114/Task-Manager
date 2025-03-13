import clsx from "clsx";
import React, { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import TaskDialog from "./task/TaskDialog";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "./UserInfo";
import { IoMdAdd } from "react-icons/io";
import AddSubTask from "./task/AddSubTask";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardDoubleArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="w-full h-fit bg-white shadow-md p-4 rounded">
        <div className="w-full flex justify-between">
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className="text-lg">{ICONS[task?.priority]}</span>
            <span className="uppercase">{task?.priority}priority</span>
          </div>

          {/* {user?.isAdmin && <TaskDialog task={task} />} */}

          {/* Always show TaskDialog */}
          {true && <TaskDialog task={task} />}
        </div>

        <>
          <div className="flex items-center gap-2">
            <div
              className={clsx("w-4 h-4 rounded-full ", TASK_TYPE[task.stage])}
            />
            <h4 className="line-clamp-1 text-black">{task?.title}</h4>
          </div>

          <span className="text-sm tert-grey-600 ">
            {formatDate(new Date(task?.date))}
          </span>
        </>
        <div className="w-full border-t border-gray-200 my-2" />
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <div className="flex item-center gap-1 text-sm text-grey-600">
              <BiMessageAltDetail />
              <span>{task?.activities?.length}</span>
            </div>
            <div className="flex item-center gap-1 text-sm text-grey-600">
              <MdAttachFile />
              <span>{task?.activities?.length}</span>
            </div>
            <div className="flex item-center gap-1 text-sm text-grey-600">
              <FaList />
              <span>{task?.activities?.length}</span>
            </div>
          </div>

          <div className="flex flex-row-reverse">
            {task?.team?.map((m, index) => (
              <div
                key={index}
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm-mr-1",
                  BGS[index % BGS?.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </div>

        {/* subtask */}
        {task?.subTasks?.length > 5 ? (
          <div className="py-4 border-t border-gray-200">
            <h5 className="text-base line-clamp-1 text-black">
              {task?.subTasks[0].title}
            </h5>
            <div className="p-4 space-x-8">
              <span className="text-sm text-gray-600">{formatDate(new Date(task?.subTasks[0]?.date))}</span>

              <span className="bg-blue-600/10 px-3 py-1 rounded-full text-blue-700 font-medium">{task?.subTasks[0].tag}</span>
            </div>
          </div>
        ) : (
          <>
          <div className="py-4 border-t border-gray-200">
            <span className=" text-green-500">NO SubTasks</span>
            </div>
          </>
        )}


        <div className="w-full pb-2">

            {/* only admin can add task yha pr ek error h ki admin null aa rha  h ya to redux me dikkat h ya to user import ni ho pa rha h data se  */}



            
            <button
             onClick={()=>setOpen(true)}
            disabled={user.isAdmin?false:true}
            className="w-full flex gap-4 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed::text-gray-300">
                <IoMdAdd className="text-lg"
               />
                <span>ADD SUBTASKS</span>
            </button>

            {/* <button 
            className="w-full flex gap-4 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed::text-gray-300">
                <IoMdAdd className="text-lg"/>
                <span>ADD SUBTASKS</span>
            </button> */}

            </div>



      </div>

      <AddSubTask open={open} setOpen={setOpen} id={task._id}/>
    </>
  );
};

export default TaskCard;
