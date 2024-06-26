import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";
import moment from "moment";

// ====== CREATE JOB ======
export const createJobController = async (req, res, next) => {
  const { title, description, tag } = req.body;
  if (!title || !description) {
    next("Please Provide All Fields");
  }
  req.body.createdBy = req.body.user.userId;
  const job = await jobsModel.create(req.body);
  res.status(201).json({ job });
};
export const getMyJobsController = async (req, res, next) => {
 try {
   const myjobs = await jobsModel.find({createdBy:req.body.user.userId}).sort({ updatedAt: -1 });
   res.status(201).json(myjobs)
  
 } catch (error) {
  res.send(500,"internal server error")
 }
};


// ======= UPDATE JOBS ===========
export const updateJobController = async (req, res, next) => {
  const { id } = req.params;
  const {ncompany, njobType, nsalary, } = req.body;
  //find job
  const job = await jobsModel.findOne({ _id: id });
  job.title =ncompany;
  job.description=njobType;
job.tag = nsalary;
  //validation
  if (!job) {
    next(`no jobs found with this id ${id}`);
  }
  if (!req.body.user.userId === job.createdBy.toString()) {
    next("Your Not Authorized to update this job");
    return;
  }
  const updateJob = await jobsModel.findByIdAndUpdate(id,
    {
      title:ncompany || job.title,
      description:njobType || job.description,
      tag:nsalary || job.tag,
      
    }
    , {
    new: true,
    runValidators: true,
  });
  //res
  res.status(200).json({ updateJob });
};

// ======= DELETE JOBS ===========
export const deleteJobController = async (req, res, next) => {
  const { id } = req.params;
  //find job
  const job = await jobsModel.findOne({ _id: id });
  //validation
  if (!job) {
    next(`No Job Found With This ID ${id}`);
  }
  if (!req.body.user.userId === job.createdBy.toString()) {
    next("Your Not Authorize to delete this job");
    return;
  }
  await job.deleteOne();
  res.status(200).json({ message: "Success, Job Deleted!" });
};

export const filterJob = async (req,res)=>{
  try{
 const  {checked,selected} = req.body;
 let filteredJob;
 let args ={}
 if(checked.includes("full-time")){
   args.jobType="full-time"
 }
 if(checked.includes("internship")){
  if(checked.includes("full-time")){
    args.jobType =["internship","full-time"]
    
  }else{
   args.jobType ="internship"
  }
  }
  if(checked.includes("Remote")){
    args.workLocation = "Remote"
  }
  if(checked.includes("latest")){
    filteredJob = await  jobsModel.find(args)
    .sort({ updatedAt: -1 }) // Sort by updatedAt field in descending order
    .limit(10); // Limit the number of results to 10
  }else{
    filteredJob = await  jobsModel.find(args)
  }
  console.log(args)
  res.status(200).json({ success: true, data: filteredJob });
} catch (error) {
  console.error(error);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
}
};

export const searchNotesController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await jobsModel
      .find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      });
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Notes API",
      error,
    });
  }
};

 