const Trainer = require('../models/Trainer');

exports.getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find().sort({ name: 1 });
    res.json(trainers);
  } catch (error) {
    next(error);
  }
};

exports.createTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json(trainer);
  } catch (error) {
    next(error);
  }
};

exports.updateTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.json(trainer);
  } catch (error) {
    next(error);
  }
};

exports.deleteTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.json({ message: 'Trainer deleted' });
  } catch (error) {
    next(error);
  }
};
