const API = 'http://localhost:5000/api';

// Main client-side logic for dashboard, member, trainer, payment, and attendance pages.
const token = localStorage.getItem('token');
let membersCache = [];

const headers = {
  'Content-Type': 'application/json',
  Authorization: token ? `Bearer ${token}` : ''
};

if (!token && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
  window.location.href = '/login';
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/';
  });
}

async function loadDashboard() {
  const container = document.getElementById('dashboardStats');
  if (!container) return;
  try {
    const response = await fetch(`${API}/dashboard`, { headers });
    const data = await response.json();
    container.innerHTML = `
      <div class="stat-card"><h3>${data.memberCount}</h3><p>Members</p></div>
      <div class="stat-card"><h3>${data.trainerCount}</h3><p>Trainers</p></div>
      <div class="stat-card"><h3>${data.paymentCount}</h3><p>Payments</p></div>
      <div class="stat-card"><h3>${data.attendanceCount}</h3><p>Attendance</p></div>
    `;
  } catch (error) {
    container.innerHTML = '<div class="stat-card"><h3>Unavailable</h3><p>Could not load dashboard data.</p></div>';
  }
}

async function loadMembers() {
  const list = document.getElementById('memberList');
  const search = document.getElementById('memberSearch');
  if (!list) return;
  try {
    const response = await fetch(`${API}/members`, { headers });
    const members = await response.json();
    membersCache = members;
    const render = (items) => {
      list.innerHTML = items.length ? items.map(member => `
        <div class="list-item">
          <div>
            <strong>${member.fullName}</strong><br />
            <span class="muted">ID: ${member.memberId || 'N/A'} • ${member.membershipType || member.plan} • ${member.contact || member.phone || 'No contact'}</span>
          </div>
          <span class="badge">${member.status}</span>
        </div>
      `).join('') : '<p class="muted">No members found.</p>';
    };
    render(members);
    search?.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      render(members.filter(member => member.fullName.toLowerCase().includes(query)));
    });
  } catch (error) {
    list.innerHTML = '<p class="muted">Unable to load members.</p>';
  }
}

async function loadTrainers() {
  const list = document.getElementById('trainerList');
  if (!list) return;
  try {
    const response = await fetch(`${API}/trainers`, { headers });
    const trainers = await response.json();
    list.innerHTML = trainers.length ? trainers.map(trainer => `
      <div class="list-item">
        <div>
          <strong>${trainer.name}</strong><br />
          <span class="muted">${trainer.specialty} • ${trainer.experience} years</span>
        </div>
        <span class="badge">${trainer.email}</span>
      </div>
    `).join('') : '<p class="muted">No trainers found.</p>';
  } catch (error) {
    list.innerHTML = '<p class="muted">Unable to load trainers.</p>';
  }
}

async function loadPayments() {
  const list = document.getElementById('paymentList');
  if (!list) return;
  try {
    const response = await fetch(`${API}/payments`, { headers });
    const payments = await response.json();
    list.innerHTML = payments.length ? payments.map(payment => `
      <div class="list-item">
        <div>
          <strong>${payment.memberName}</strong><br />
          <span class="muted">${payment.month} • ${payment.method}</span>
        </div>
        <span class="badge">$${payment.amount}</span>
      </div>
    `).join('') : '<p class="muted">No payments found.</p>';
  } catch (error) {
    list.innerHTML = '<p class="muted">Unable to load payments.</p>';
  }
}

async function loadAttendance() {
  const list = document.getElementById('attendanceList');
  if (!list) return;
  try {
    const response = await fetch(`${API}/attendance?date=${new Date().toISOString().split('T')[0]}`, { headers });
    const records = await response.json();
    list.innerHTML = records.length ? records.map(record => `
      <div class="list-item attendance-entry">
        <div>
          <strong>${record.memberName}</strong><br />
          <span class="times">In: ${record.checkInTime || '--'} • Out: ${record.checkOutTime || '--'}</span>
        </div>
        <span class="badge">${record.status}</span>
      </div>
    `).join('') : '<p class="muted">No attendance records for today.</p>';
  } catch (error) {
    list.innerHTML = '<p class="muted">Unable to load attendance.</p>';
  }
}

async function lookupMember() {
  const form = document.getElementById('memberLookupForm');
  const details = document.getElementById('memberDetails');
  if (!form || !details) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const memberId = document.getElementById('memberLookupId').value.trim();
    if (!memberId) return;

    try {
      const response = await fetch(`${API}/members/lookup/${memberId}`, { headers });
      if (!response.ok) throw new Error('Member not found');
      const member = await response.json();

      // Fetch today's attendance for this member
      const today = new Date().toISOString().split('T')[0];
      const attResponse = await fetch(`${API}/attendance?date=${today}&memberId=${memberId}`, { headers });
      let checkInTime = 'Not checked in today';
      let checkOutTime = 'Not checked out today';

      if (attResponse.ok) {
        const attRecords = await attResponse.json();
        if (attRecords && attRecords.length > 0) {
          const record = attRecords[0];
          checkInTime = record.checkInTime || 'Not checked in today';
          checkOutTime = record.checkOutTime || 'Not checked out today';
        }
      }

      details.innerHTML = `
        <div class="lookup-result">
          <h4>${member.fullName}</h4>
          <p><strong>Member ID:</strong> ${member.memberId || 'N/A'}</p>
          <p><strong>Membership Package:</strong> ${member.membershipType || member.plan || 'N/A'}</p>
          <p><strong>Check-In Time (Today):</strong> ${checkInTime}</p>
          <p><strong>Check-Out Time (Today):</strong> ${checkOutTime}</p>
        </div>
      `;
    } catch (error) {
      details.innerHTML = '<p class="muted">No member found for that ID.</p>';
    }
  });
}

async function loadLiveAttendance() {
  const list = document.getElementById('liveAttendanceList');
  if (!list) return;
  try {
    const [attendanceResponse, membersResponse] = await Promise.all([
      fetch(`${API}/attendance`, { headers }),
      fetch(`${API}/members`, { headers })
    ]);
    const records = await attendanceResponse.json();
    const members = await membersResponse.json();
    membersCache = members;

    const activeRecords = records.filter(record => record.checkedIn !== false && record.status !== 'Checked Out');
    list.innerHTML = activeRecords.length ? activeRecords.map(record => {
      const member = members.find(item => item.memberId === record.personId || item.fullName.toLowerCase() === record.memberName.toLowerCase());
      const membershipStatus = member?.status || record.membershipStatus || 'Active';
      return `
        <div class="list-item">
          <div>
            <strong>${record.memberName}</strong><br />
            <span class="muted">Checked in at ${record.checkInTime || '--'} • Status: ${membershipStatus}</span>
          </div>
          <span class="badge">Live</span>
        </div>
      `;
    }).join('') : '<p class="muted">No members checked in right now.</p>';
  } catch (error) {
    list.innerHTML = '<p class="muted">Attendance feed unavailable.</p>';
  }
}

async function submitMember() {
  const form = document.getElementById('memberForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      contact: document.getElementById('contact').value,
      membershipType: document.getElementById('membershipType').value,
      startDate: document.getElementById('startDate').value,
      status: document.getElementById('status').value
    };
    try {
      const response = await fetch(`${API}/members`, { method: 'POST', headers, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Failed to save member');
      const createdMember = await response.json();
      form.reset();
      loadMembers();
      alert(`Member added successfully. Member ID: ${createdMember.memberId}`);
    } catch (error) {
      alert(error.message);
    }
  });
}

async function submitTrainer() {
  const form = document.getElementById('trainerForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById('trainerName').value,
      specialty: document.getElementById('specialty').value,
      email: document.getElementById('trainerEmail').value,
      phone: document.getElementById('trainerPhone').value,
      experience: Number(document.getElementById('experience').value)
    };
    try {
      const response = await fetch(`${API}/trainers`, { method: 'POST', headers, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Failed to save trainer');
      form.reset();
      loadTrainers();
    } catch (error) {
      alert(error.message);
    }
  });
}

async function submitPayment() {
  const form = document.getElementById('paymentForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      memberName: document.getElementById('memberName').value,
      amount: Number(document.getElementById('amount').value),
      method: document.getElementById('method').value,
      month: document.getElementById('month').value
    };
    try {
      const response = await fetch(`${API}/payments`, { method: 'POST', headers, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Failed to save payment');
      form.reset();
      loadPayments();
    } catch (error) {
      alert(error.message);
    }
  });
}

async function submitAttendance() {
  const form = document.getElementById('attendanceForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const memberName = document.getElementById('attendanceMember').value;
    const personId = document.getElementById('attendancePersonId').value;
    const matchedMember = membersCache.find(item => item.memberId === personId || item.fullName.toLowerCase() === memberName.toLowerCase());
    const payload = {
      memberName,
      personId,
      date: document.getElementById('attendanceDate').value,
      checkInTime: document.getElementById('checkInTime').value,
      checkOutTime: document.getElementById('checkOutTime').value,
      status: document.getElementById('attendanceStatus').value,
      checkedIn: document.getElementById('attendanceStatus').value === 'Checked In',
      membershipStatus: matchedMember?.status || 'Active'
    };
    try {
      const response = await fetch(`${API}/attendance`, { method: 'POST', headers, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Failed to save attendance');
      form.reset();
      loadAttendance();
      loadLiveAttendance();
    } catch (error) {
      alert(error.message);
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('attendanceDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  const checkInInput = document.getElementById('checkInTime');
  if (checkInInput) {
    checkInInput.value = '09:00';
  }

  const checkOutInput = document.getElementById('checkOutTime');
  if (checkOutInput) {
    checkOutInput.value = '17:00';
  }

  if (token) {
    loadDashboard();
    loadMembers();
    loadTrainers();
    loadPayments();
  }

  loadAttendance();
  loadLiveAttendance();
  lookupMember();
  setInterval(loadLiveAttendance, 5000);
  submitMember();
  submitTrainer();
  submitPayment();
  submitAttendance();
});
