import clsx from 'clsx';
import React, { useState } from 'react'
import {BiMessageAltDetail} from "react-icons/bi";
import{
    MdAttachFile,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
}from "react-icons/md"

import {toast} from "sonner";
import { BGS, PRIOTITYSTYELS, TASK_TYPE } from '../../utils';
import UserInfo from '../UserInfo';
import moment from 'moment';

const ICONS={
    high:<MdKeyboardDoubleArrowUp/>,
    medium:<MdKeyboardArrowUp/>,
    low:<MdKeyboardArrowDown/>

};




const Table = ({tasks}) => {

    const [openDialog,setOpenDialog]=useState(false);
    const [selected,setSelected]=useState(null);



    const TableHeader = () => (
        <thead className='border-b border-gray-300 '>
          <tr className='text-black text-left'>
            <th className='py-2'>Task Title</th>
            <th className='py-2'>Priority</th>
            <th className='py-2 hidden md:block'>Created At</th>
            <th className='py-2'>Assets</th>
            <th className='py-2'>Team</th>
          </tr>
        </thead>
    );

    const TableRow = ({ task }) => (
        <tr className='border-b border-gray-300 text-gray-600 hover:bg-gray-300/10'>
          <td className='py-2'>
            <div className='flex items-center gap-2'>
              <div
                className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
              />
    
              <p className='text-base text-black'>{task.title}</p>
            </div>
          </td>
    
          <td className='py-2'>
            <div className='flex gap-1 items-center'>
              <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
                {ICONS[task.priority]}
              </span>
              <span className='capitalize'>{task.priority}</span>
            </div>
          </td>

          <td className='py-2 hidden md:block'>
            <span className='text-base text-gray-600'>
              {moment(task?.date).fromNow()}
            </span>
          </td>

          <td className='py-2'>
            <div className='flex gap-1 items-center'>
              Assets
            </div>
          </td>

          
    
          <td className='py-2'>
            <div className='flex'>
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
        </tr>
      );
    
  return (
    <>
    <div className='w-full  bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded'>
    <div className='overflow-x-auto'>
    <table className='w-full'>
      <TableHeader />
      <tbody>
        {tasks?.map((task, id) => (
          <TableRow key={id} task={task} />
        ))}
      </tbody>
    </table>
    </div>
  </div>


</>
  )
}

export default Table