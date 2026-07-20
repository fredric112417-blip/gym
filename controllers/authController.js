const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateUniqueMemberId = async () => {
  const prefix = 'MB';
  let memberId = '';
  let exists = true;

  while (exists) {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    memberId = `${prefix}${randomNumber}`;
    exists = await User.exists({ memberId });
  }

  return memberId;
};

// Register a new user and issue a JWT token.
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'member', gender = 'other', address = '', goal = 'general', package: selectedPackage = '1 month', coachRequested = false } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const packageFees = { '12 month': 5500, '6 month': 2500, '1 month': 500 };
    const coachFee = coachRequested ? 500 : 0;
    const fees = packageFees[selectedPackage] + coachFee;

    const hashedPassword = await bcrypt.hash(password, 10);
    const memberId = role === 'member' ? await generateUniqueMemberId() : undefined;
    const user = await User.create({ name, email, password: hashedPassword, role, gender, address, goal, package: selectedPackage, fees, coachRequested, coachFee, memberId });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, gender: user.gender, address: user.address, goal: user.goal, package: user.package, fees: user.fees, coachRequested: user.coachRequested, coachFee: user.coachFee, memberId: user.memberId } });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};
