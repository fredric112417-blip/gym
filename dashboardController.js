const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');

exports.getDashboard = async (req, res, next) => {
  try {
    const memberCount = await Member.countDocuments();
    const trainerCount = await Trainer.countDocuments();
    const paymentCount = await Payment.countDocuments();
    const attendanceCount = await Attendance.countDocuments();

    res.json({
      memberCount,
      trainerCount,
      paymentCount,
      attendanceCount,
      planStats: {
        Platinum: await Member.countDocuments({ plan: 'Platinum' }),
        Gold: await Member.countDocuments({ plan: 'Gold' }),
        Silver: await Member.countDocuments({ plan: 'Silver' })
      }
    });
  } catch (error) {
    next(error);
  }
};
