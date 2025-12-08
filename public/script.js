const API_URL = '/api/complaints';

document.getElementById('complaintForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const complaint = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    priority: document.getElementById('priority').value
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaint)
    });
    
    if (response.ok) {
      alert('Complaint submitted successfully!');
      document.getElementById('complaintForm').reset();
      loadComplaints();
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

async function loadComplaints() {
  try {
    const response = await fetch(API_URL);
    const complaints = await response.json();
    const list = document.getElementById('complaintsList');
    
    if (complaints.length === 0) {
      list.innerHTML = '<p>No complaints yet.</p>';
      return;
    }

    list.innerHTML = complaints.map(c => `
      <div class="alert alert-warning">
        <h6>${c.title}</h6>
        <p>${c.description}</p>
        <small>Status: <strong>${c.status}</strong> | Priority: ${c.priority}</small>
        <div class="mt-2">
          <button class="btn btn-sm btn-success" onclick="updateStatus(${c.id}, 'Resolved')">Resolve</button>
          <button class="btn btn-sm btn-danger" onclick="deleteComplaint(${c.id})">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading complaints:', error);
  }
}

async function updateStatus(id, status) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadComplaints();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function deleteComplaint(id) {
  if (!confirm('Delete this complaint?')) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadComplaints();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

loadComplaints();
setInterval(loadComplaints, 5000);
