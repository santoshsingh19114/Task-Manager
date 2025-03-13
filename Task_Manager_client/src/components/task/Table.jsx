import clsx from "clsx";
import React, { useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import ConfirmatioDialog from "../Dialogs";

import { toast } from "sonner";
import { BGS, formatDate, PRIOTITYSTYELS, TASK_TYPE } from "../../utils";
import UserInfo from "../UserInfo";
import moment from "moment";
import { FaList } from "react-icons/fa";
import Button from "../Button";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);

  const deleteClicks=(id)=>{

    setSelected(id);
    setOpenDialog(true);
  };


  const deleteHandler=()=>{}

  const TableHeader = () => (
    <thead className="border-b border-gray-300 ">
      <tr className="text-black text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2 hidden md:block">Created At</th>
        <th className="py-2">Assets</th>
        <th className="py-2">Team</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-300 text-gray-600 hover:bg-gray-300/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />

          <p className="text-base text-black">{task.title}</p>
        </div>
      </td>

      <td className="py-2">
        <div className="flex gap-1 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className="capitalize">{task.priority}</span>
        </div>
      </td>

      <td className="py-2 hidden md:block">
        <span className="text-base text-gray-600">
          {formatDate(new Date(task?.date))}
        </span>
      </td>

      <td className="py-2">
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
      </td>

      <td className="py-2">
        <div className="flex">
          {task.team.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>

      <td className="py-2 flex gap-2 md:gap-4 justify-end">
        <Button
        className="text-blue-600 hover:text-blue-500  sm:px-0 text-sm md:text-base"
        label="Edit"
        type='button'
        />
        <Button
        className="text-blue-600 hover:text-blue-500  sm:px-0 text-sm md:text-base"
        label="Delete"
        type='button'
        onClick={()=>deleteClicks(task._id)}
        />
      </td>

    </tr>
  );

  return (
    <>
      <div className="w-full  bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody>
              {tasks?.map((task, id) => (
                <TableRow key={id} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

    </>
  );
};

export default Table;
