const mongoose = require('mongoose');
const Member = require('./models/Member');

(async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/gym_management');
    console.log('plan required:', Member.schema.path('plan').isRequired);
    console.log('phone required:', Member.schema.path('phone').isRequired);
    const doc = await Member.create({
      fullName: 'Direct Test',
      email: 'direct@example.com',
      contact: '123',
      membershipType: 'Basic',
      startDate: '2026-01-01',
      status: 'Active'
    });
    console.log('created:', JSON.stringify(doc.toObject()));
  } catch (err) {
    console.error('ERR');
    console.error(err.message);
    console.error(JSON.stringify(err.errors));
  } finally {
    await mongoose.disconnect();
  }
})();
