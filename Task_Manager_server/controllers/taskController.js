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

    res
      .status(200)
      .json({ status: true, message: "task created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.paramms;

    const task = await Task.findById(id);
    const newTask = await Task.create({
      ...task,
      title: task.title + "-Duplicate",
    });

    newTask.team = task.team;
    // newTask.subTasks=task.subTasks;
    newTask.subtask = task.subtask;
    newTask.assets = task.assets;
    newTask.priority = task.priority;
    newTask.stage = task.stage;

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

    res
      .status(200)
      .json({ status: true, message: "task created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const postTaskactivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { type, activity } = req.body;

    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };

    task.activities.push(data);
    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title,email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: { userId } },
        })
          .populate({
            path: "team",
            select: "name role title,email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isAdmin created")
      .limit(10)
      .sort({ _id: -1 });

    //group task by stage and calculate counts

    const groupTasks = allTasks.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    //group by priority

    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    //calculate total tasks
    const totalTasks = allTasks?.length;
    const last10Task = allTasks?.slice(0, 10);

    const summary = {
      totalTasks,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupTasks,
      graphData: groupData,
    };

    res.status(200).json({
      status: true,
      message: "successfully",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};




export const getTasks = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query;

    let query = { isTrashed: isTrashed ? true : false };

    if (stage) {
      query.stage = stage;
    }

    let queryResult = Task.find(query)
      .populate({
        path: "team",
        select: "name title email",
      })
      .sort({ _id: -1 });

    const tasks = await queryResult;

    res.status(200).json({
      status: true,
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({
        path: "team",
        select: "name title role email",
      })
      .populate({
        path: "activities.by",
        select: "name",
      });

    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


// export const postTaskactivity = async(req,res)=>{
//     try{

//     }
//     catch(error){
//         console.log(error);
//         return res.status(400).json({status:false,message:error.message});

//     }
// }
