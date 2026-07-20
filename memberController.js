const Member = require('../models/Member');

const generateMemberId = async () => {
  let memberId = '';
  let exists = true;

  while (exists) {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    memberId = `MEM${randomNumber}`;
    exists = await Member.exists({ memberId });
  }

  return memberId;
};

// Retrieve and manage gym members through CRUD operations.
exports.getMembers = async (req, res, next) => {
  try {
    const members = await Member.find().sort({ joinedDate: -1 });
    res.json(members);
  } catch (error) {
    next(error);
  }
};

exports.getMemberById = async (req, res, next) => {
  try {
    const memberId = req.params.memberId;
    const member = await Member.findOne({ memberId: { $regex: `^${memberId}$`, $options: 'i' } });

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    next(error);
  }
};

exports.createMember = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      memberId: req.body.memberId || (await generateMemberId()),
      phone: req.body.phone || req.body.contact || '',
      plan: req.body.plan || req.body.membershipType || 'Basic'
    };

    const member = await Member.create(payload);
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
};

exports.updateMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) {
    next(error);
  }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted' });
  } catch (error) {
    next(error);
  }
};
