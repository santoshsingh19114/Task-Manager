import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";
export const createTask = async (req, res) => {
  try {
    const { userId } = req.user;

    const { title, team, stage, date, priority, assets } = req.body;

    let text = "New task has been assigned to you";
    if (team?.length > 1) {
      text = text + ` and ${team?.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${priority} priority, so check and act accordingly. The task date is ${new Date(
        date
      ).toDateString()}. Thank you!!!`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    const task = await Task.create({
      title,
      team,
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
      assets,
      activities: activity,
    });

    await Notice.create({
      team,
      text,
      task: task._id,
    });

    res
      .status(200)
      .json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;

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
      text + `and ${task.team.length - 1} others`;
    }

    text =
      text +
      `The task priority is set a ${
        task.priority
      } priority,so check and act accordingly. The task Date is ${task.date.toDateString()},Thank You!!`;

    await Notice.create({ team: task.team, text, task: newTask._id });

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
    // console.log(userId);
    // console.log(isAdmin);

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
          team:userId ,
        })
          .populate({
            path: "team",
            select: "name role title,email",
          })
          .sort({ _id: -1 });

    console.log(allTasks);

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
    console.log(totalTasks);
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



// export const getTasks = async (req, res) => {
//   try {
//     console.log("Query Params:", req.query);

//     const { stage, isTrashed } = req.query;
//     console.log(stage);
    

//     let query = {};

//     if (typeof isTrashed !== "undefined") {
//       query.isTrashed = isTrashed === "true"; // string to boolean
//     }

//     if (stage) {
//       // Normalize stage value from 'inProgress' to 'in progress'
//       if (stage === "inProgress") {
//         query.stage = "in progress";
//       } else {
//         query.stage = stage; // Use the exact stage value if it's not 'inProgress'
//       }
//     }

//     console.log("Final Query:", query);

//     const tasks = await Task.find(query)
//       .populate({
//         path: "team",
//         select: "name title email",
//       })
//       .sort({ _id: -1 });

//     return res.status(200).json({
//       status: true,
//       tasks,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ status: false, message: error.message });
//   }
// };


export const getTasks = async (req, res) => {
  try {
    const { stage, isTrashed, search } = req.query;
    
    let query = {};

    // Handle trashed tasks
    if (typeof isTrashed !== "undefined") {
      query.isTrashed = isTrashed === "true"; // string to boolean
    }

    // Handle stage filtering
    if (stage) {
      // Normalize stage value from 'inProgress' to 'in progress'
      if (stage === "inProgress") {
        query.stage = "in progress";
      } else {
        query.stage = stage; // Use the exact stage value if it's not 'inProgress'
      }
    }

    // Handle search functionality
    if (search) {
      // Use regex to search for task titles (case-insensitive)
      query.title = { $regex: search, $options: "i" };
    }

    const tasks = await Task.find(query)
      .populate({
        path: "team",
        select: "name title email",
      })
      .sort({ _id: -1 });

    return res.status(200).json({
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

      console.log(task);
      res.status(200).json({
      status: true,
      task,
    });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const createSubTask = async (req, res) => {
  try {
    const { title, tag, date } = req.body;
    const { id } = req.params;

    const newSubTask = {
      title,
      date,
      tag,
    };

    const task = await Task.findById(id);
    task.subtask.push(newSubTask);

    await task.save();

    res.status(200).json({
      status: true,
      message: "SubTask added successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, team, stage, priority, assets } = req.body;

    const task = await Task.findById(id);

    task.title = title;
    task.date = date;
    task.team = team;
    task.stage = stage;
    task.priority = priority;
    task.assets = assets;

    console.log(task);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const trashTask = async (req, res) => {
  try {
    console.log("hii");
    const { id } = req.params;

    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    return res.status(200).json({ status: true, message: "Task moved to trash successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Task.findById(id);

      resp.isTrashed = false;
      resp.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
