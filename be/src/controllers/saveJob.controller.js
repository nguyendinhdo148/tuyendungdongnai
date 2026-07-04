import { SaveJob } from "../models/saveJob.model.js";

export const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.id;

    const exists = await SaveJob.findOne({ user: userId, job: jobId });
    if (exists) return res.status(400).json({ message: "Job already saved" });

    const newSave = await SaveJob.create({ user: userId, job: jobId });
    res.status(201).json(newSave);
  } catch (error) {
    next(error);
  }
};

export const unsaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.id;

    await SaveJob.findOneAndDelete({ user: userId, job: jobId });
    res.status(200).json({ message: "Job unsaved" });
  } catch (error) {
    next(error);
  }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await SaveJob.find({ user: req.id }).populate({
      path: "job",
      populate: {
        path: "company",
        select: "name logo location",
      },
    });
    res.status(200).json({
      savedJobs,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
