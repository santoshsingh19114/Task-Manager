import Task from "../models/task.js";
export const createTask = async (req, res) => {
  try {
    const { title, team, stage, date, priority, asstes } = req.body;

    const task = await Task.create({
      title,
      team,
      stage: stage.toLowerCase(),
      date,
      priority: stage.toLowerCase(),
      asstes,
    });

    let text = "New task has been assigned to you";

    if (task.team.length > 1) {
      textext + `and ${task.team.length - 1} others`;
    }

    text =
      text +
      `The task priority is set a ${
        task.priority
      } priority,so check and act accordingly. The task Date is ${task.date.toDatestring()},Thank You!!`;

    await Notice.create({ team, text, task: task._id });


    res.status(200)
    .json({status:true,message:"task created successfully."});



  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const duplicateTask  = async(req,res)=>{
    try{
    const {id} =req.paramms;


    const task =await Task.findById(id);
    const newTask=await Task.create({
        ...task,title:task.title+"-Duplicate"
    })
    
    newTask.team=task.team;
    // newTask.subTasks=task.subTasks;
    newTask.subtask=task.subtask;
    newTask.assets=task.assets;
    newTask.priority=task.priority;
    newTask.stage=task.stage;


    await newTask.save();


    let text = "New task has been assigned to you";

    if (task.team.length > 1) {
      textext + `and ${task.team.length - 1} others`;
    }

    text =
      text +
      `The task priority is set a ${
        task.priority
      } priority,so check and act accordingly. The task Date is ${task.date.toDatestring()},Thank You!!`;

    await Notice.create({ team, text, task: newTask._id });


    res.status(200)
    .json({status:true,message:"task created successfully."});



    }
    catch(error){
        console.log(error);
        return res.status(400).json({status:false,message:error.message});

    }
}

export const postTaskactivity = async(req,res)=>{
    try{

        const {id}=req.params;
        const {userId}=req.user;
        const {type,activity}=req.body;


        const task=await Task.findById(id);

        const data={
            type,
            activity,
            by:userId,
        };


        task.activities.push(data);
        await task.save();


        res.status(200)
        .json({status:true,message:"Activity posted successfully."});

    }
    catch(error){
        console.log(error);
        return res.status(400).json({status:false,message:error.message});

    }
}
// export const postTaskactivity = async(req,res)=>{
//     try{

//     }
//     catch(error){
//         console.log(error);
//         return res.status(400).json({status:false,message:error.message});

//     }
// }
