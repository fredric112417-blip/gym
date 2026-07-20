const Attendance = require('../models/Attendance');

exports.getAttendance = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.date) filter.date = req.query.date;
    if (req.query.memberId) filter.personId = { $regex: `^${req.query.memberId}$`, $options: 'i' };

    const attendance = await Attendance.find(filter).sort({ createdAt: -1 });
    res.json(attendance);
  } catch (error) {
    next(error);
  }
};

exports.createAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.create({
      ...req.body,
      checkedIn: req.body.status !== 'Checked Out',
      status: req.body.status || 'Checked In'
    });
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

exports.updateAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, {
      checkedIn: false,
      status: 'Checked Out',
      checkOutTime: req.body.checkOutTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }, { new: true });
    if (!record) return res.status(404).json({ message: 'Attendance record not found' });
    res.json(record);
  } catch (error) {
    next(error);
  }
};

exports.deleteAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Attendance record not found' });
    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    next(error);
  }
};
