import express from "express";
import {
  createJobController,
  deleteJobController,
  updateJobController,
  filterJob,
  getMyJobsController,
  searchNotesController
} from "../controllers/jobsController.js";
import userAuth from "../middelwares/authMiddleware.js";

const router = express.Router();

//routes
// CREATE JOB || POST
router.post("/create-job", userAuth, createJobController);

//GET JOBS || GET
router.get("/get-myjob", userAuth, getMyJobsController);

//UPDATE JOBS ||  PATCH
router.patch("/update-job/:id", userAuth, updateJobController);

//DELETE JOBS || DELETE
router.delete("/delete-job/:id", userAuth, deleteJobController);

router.post("/filter-job",userAuth,filterJob)

router.get("/search/:keyword", searchNotesController);

export default router;
