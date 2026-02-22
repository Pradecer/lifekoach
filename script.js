/* ---------- Quick interactive wiring: every icon/card clickable with content ---------- */

/* Safety: hide tagline quickly if animation not supported */
window.addEventListener("load", () => {
  setTimeout(() => {
    const o = document.getElementById("taglineOverlay");
    if (o) o.style.display = "none";
  }, 1100);
});

/* Basic data (mentors/services) */
const mentors = [
  {
    id: 1,
    name: "Lily Fierra",
    expertise: "Career Coach",
    fee: 299,
    photo: "public/mentors/lily.jpg",
    bio: "Career planning, resume, interview prep.",
  },
  {
    id: 2,
    name: "Neha Kapoor",
    expertise: "Financial Advisor",
    fee: 349,
    photo: "public/mentors/neha.jpg",
    bio: "Budgeting, savings, student loans.",
  },
  {
    id: 3,
    name: "Rohan Sharma",
    expertise: "Academic Mentor",
    fee: 249,
    photo: "public/mentors/rohan.jpg",
    bio: "Study skills, exam strategy, time management.",
  },
  {
    id: 4,
    name: "Dr. Ananya Singh",
    expertise: "Wellness Coach",
    fee: 399,
    photo: "public/mentors/ananya.jpg",
    bio: "Stress, sleep, mindfulness and burnout recovery.",
  },
  {
    id: 5,
    name: "Vikram Desai",
    expertise: "Industry Specialist",
    fee: 349,
    photo: "public/mentors/vikram.jpg",
    bio: "Industry insights, internships, career switch.",
  },
  {
    id: 6,
    name: "Priya Nair",
    expertise: "Relationship Counsellor",
    fee: 299,
    photo: "public/mentors/priya.jpg",
    bio: "Communication, family dynamics, relationships.",
  },
];

const defaultSlots = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
];

/* DOM refs */
const slotsContainer = document.getElementById("slots");
const openMentorsBtn = document.getElementById("openMentors");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalBody = document.getElementById("modalBody");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.getElementById("closeModalBtn");
const messagesEl = document.getElementById("messages");
const chatInput = document.getElementById("chatInput");
const commentsList = document.getElementById("commentsList");
const bookingSummary = document.getElementById("bookingSummary");
const selectedMentorEl = document.getElementById("selectedMentor");

/* helper: show modal with content */
function showModal(title, html) {
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modalBackdrop.style.display = "flex";
  modalBackdrop.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modalBackdrop.style.display = "none";
  modalBackdrop.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
closeModalBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* render slots */
let selectedSlot = null;
function renderSlots() {
  if (!slotsContainer) return;
  slotsContainer.innerHTML = "";
  defaultSlots.forEach((s) => {
    const el = document.createElement("div");
    el.className = "slot";
    el.textContent = s;
    el.addEventListener("click", () => {
      document
        .querySelectorAll(".slot")
        .forEach((x) => x.classList.remove("selected"));
      el.classList.add("selected");
      selectedSlot = s;
      updateBookingSummary();
    });
    slotsContainer.appendChild(el);
  });
}
renderSlots();

/* open mentors modal */
openMentorsBtn.addEventListener("click", () => openMentorList());
function openMentorList() {
  let html =
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">';
  mentors.forEach((m) => {
    html += `<div style="display:flex;gap:10px;align-items:center;padding:10px;border-radius:10px;border:1px solid #eef2f6">
      <div style="width:64px;height:64px;border-radius:12px;overflow:hidden"><img src="${m.photo}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover"></div>
      <div style="flex:1">
        <div style="font-weight:700">${m.name}</div>
        <div class="muted-small">${m.expertise} • ₹${m.fee}</div>
      </div>
      <div><button class="btn" onclick="selectMentor(${m.id})">Select</button></div>
    </div>`;
  });
  html += "</div>";
  showModal("Choose a Mentor", html);
}

/* select mentor */
function selectMentor(id) {
  const m = mentors.find((x) => x.id === id);
  if (!m) return;
  selectedMentorEl.innerHTML = `<div style="display:flex;gap:10px;align-items:center"><div style="width:64px;height:64px;border-radius:12px;overflow:hidden"><img src="${m.photo}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover"></div><div><strong style="color:var(--growth)">${m.name}</strong><div class="muted-small">${m.expertise} • ₹${m.fee}</div></div></div>`;
  localStorage.setItem("selectedMentor", JSON.stringify(m));
  closeModal();
  updateBookingSummary();
}

/* issue-card click -> show recommended mentor + content */
document.querySelectorAll(".issue-card").forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.dataset.key;
    const title = card.querySelector(".issue-title").textContent;
    const desc = card.querySelector(".muted")
      ? card.querySelector(".muted").textContent
      : "";
    // pick mentor by simple mapping
    const map = {
      academic: mentors[2],
      industry: mentors[4],
      finance: mentors[1],
      relationship: mentors[5],
      health: mentors[3],
      "career-guidance": mentors[0],
    };
    const mentor = map[key] || mentors[0];
    const html = `
      <h4>${title}</h4>
      <p class="muted-small">${desc}</p>
      <hr>
      <div style="display:flex;gap:12px;align-items:center">
        <div style="width:72px;height:72px;border-radius:12px;overflow:hidden"><img src="${mentor.photo}" alt="${mentor.name}" style="width:100%;height:100%;object-fit:cover"></div>
        <div>
          <div style="font-weight:800;color:var(--growth)">${mentor.name}</div>
          <div class="muted-small">${mentor.expertise} • ₹${mentor.fee}</div>
          <div style="margin-top:8px" class="muted-small">${mentor.bio}</div>
        </div>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn" onclick="selectMentorAndScroll(${mentor.id})">Select Mentor</button>
        <button class="btn ghost" onclick="closeModal()">Close</button>
      </div>
    `;
    showModal(title, html);
  });
});
function selectMentorAndScroll(id) {
  selectMentor(id);
  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
}

/* services — filter pills */
document.querySelectorAll("#filterPills .pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document
      .querySelectorAll("#filterPills .pill")
      .forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    const cat = pill.dataset.cat;
    document.querySelectorAll(".service-card").forEach((card) => {
      const match = cat === "all" || card.dataset.cat === cat;
      card.classList.toggle("hidden", !match);
    });
  });
});

/* services — sort */
document.getElementById("sortSelect").addEventListener("change", (e) => {
  const grid = document.getElementById("servicesGrid");
  const cards = Array.from(grid.querySelectorAll(".service-card"));
  if (e.target.value === "price") {
    cards.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
  } else {
    cards.sort((a, b) => (a.dataset.id > b.dataset.id ? 1 : -1));
  }
  cards.forEach((c) => grid.appendChild(c));
});

/* services — card click */
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.classList.contains("svc-btn")) return;
    const title = card.querySelector(".svc-title")
      ? card.querySelector(".svc-title").textContent
      : card.dataset.id;
    const desc = card.querySelector(".svc-desc")
      ? card.querySelector(".svc-desc").textContent
      : "";
    const price = card.querySelector(".svc-price")
      ? card.querySelector(".svc-price").textContent
      : "";
    const html = `<h4>${title}</h4><p class="muted-small">${desc}</p><p class="muted-small"><strong>Price:</strong> ${price}</p><hr><p class="muted-small"><strong>Includes:</strong></p><ul class="muted-small"><li>Personalised session plan</li><li>Follow-up notes &amp; resources</li><li>Direct mentor access</li></ul><div style="margin-top:14px;display:flex;gap:8px"><button class="btn" onclick="openMentorList()">Choose Mentor</button><button class="btn ghost" onclick="closeModal()">Close</button></div>`;
    showModal(title, html);
  });
});

/* team cards clickable -> show profile */
document.querySelectorAll(".team-card").forEach((card) => {
  card.addEventListener("click", () => {
    const name =
      card.dataset.name || card.querySelector(".team-name").textContent;
    const role =
      card.dataset.role || card.querySelector(".team-role").textContent;
    const img = card.querySelector("img") ? card.querySelector("img").src : "";
    const html = `<div style="display:flex;gap:12px;align-items:center"><div style="width:96px;height:96px;border-radius:12px;overflow:hidden"><img src="${img}" alt="${name}" style="width:100%;height:100%;object-fit:cover"></div><div><div style="font-weight:800">${name}</div><div class="muted-small">${role}</div><div style="margin-top:8px" class="muted-small">Short bio or responsibilities for ${name}. You can add contact, availability, and expertise here.</div></div></div><div style="margin-top:12px"><button class="btn" onclick="closeModal()">Close</button></div>`;
    showModal(name, html);
  });
});

/* brand click -> about modal */
document.getElementById("brandBtn").addEventListener("click", () => {
  const html = `<h4>About LIFEKOACH</h4><p class="muted-small">We connect students and young professionals with verified mentors across career, finance, academics, wellness and relationships. Built to be affordable, confidential and practical.</p><div style="margin-top:12px"><button class="btn" onclick="closeModal()">Close</button></div>`;
  showModal("About LIFEKOACH", html);
});

/* nav links scroll */
document
  .getElementById("navHome")
  .addEventListener("click", () =>
    document.getElementById("home").scrollIntoView({ behavior: "smooth" }),
  );
document
  .getElementById("navServices")
  .addEventListener("click", () =>
    document.getElementById("services").scrollIntoView({ behavior: "smooth" }),
  );
document
  .getElementById("navTeam")
  .addEventListener("click", () =>
    document.getElementById("team").scrollIntoView({ behavior: "smooth" }),
  );
document
  .getElementById("navContact")
  .addEventListener("click", () =>
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" }),
  );

/* booking summary & actions (local fallback) */
function updateBookingSummary() {
  const date = document.getElementById("bookingDate").value;
  const duration = document.getElementById("duration").value;
  const notes = document.getElementById("bookingNotes").value;
  const mentor = JSON.parse(localStorage.getItem("selectedMentor") || "null");
  if (!date || !selectedSlot || !mentor) {
    bookingSummary.textContent =
      "Select date, time slot and mentor to see summary";
    return;
  }
  bookingSummary.innerHTML = `<div><strong style="color:var(--growth)">${mentor.name}</strong></div><div class="muted-small">${date} • ${selectedSlot} • ${duration} mins</div><div class="muted-small" style="margin-top:8px">${notes || "No notes"}</div>`;
}
document.getElementById("proceedPay").addEventListener("click", () => {
  const booking = collectBooking();
  if (!booking) return alert("Please select date, slot and mentor");
  saveBookingLocal(booking);
  alert("Booking confirmed (local).");
  clearBookingForm();
});
document.getElementById("saveDraft").addEventListener("click", () => {
  const booking = collectBooking();
  if (!booking) return alert("Please select date, slot and mentor");
  booking.status = "draft";
  saveBookingLocal(booking);
  alert("Booking saved as draft.");
  clearBookingForm();
});
function collectBooking() {
  const date = document.getElementById("bookingDate").value;
  const duration = document.getElementById("duration").value;
  const notes = document.getElementById("bookingNotes").value;
  const mentor = JSON.parse(localStorage.getItem("selectedMentor") || "null");
  if (!date || !selectedSlot || !mentor) return null;
  return {
    id: "bk_" + Date.now(),
    date,
    slot: selectedSlot,
    duration,
    notes,
    mentor,
    at: Date.now(),
  };
}
function saveBookingLocal(booking) {
  const all = JSON.parse(localStorage.getItem("bookings") || "[]");
  all.push(booking);
  localStorage.setItem("bookings", JSON.stringify(all));
}
function clearBookingForm() {
  document.getElementById("bookingDate").value = "";
  document.getElementById("bookingNotes").value = "";
  document.getElementById("duration").value = "30";
  document
    .querySelectorAll(".slot")
    .forEach((x) => x.classList.remove("selected"));
  selectedSlot = null;
  localStorage.removeItem("selectedMentor");
  selectedMentorEl.textContent = "No mentor selected";
  updateBookingSummary();
}
function loadBookingFromStorage() {
  const all = JSON.parse(localStorage.getItem("bookings") || "[]");
  if (all.length) {
    const last = all[all.length - 1];
    bookingSummary.innerHTML = `<div><strong style="color:var(--growth)">${last.mentor.name}</strong></div><div class="muted-small">${last.date} • ${last.slot} • ${last.duration} mins</div><div class="muted-small" style="margin-top:8px">${last.notes || "No notes"}</div>`;
  }
}
loadBookingFromStorage();

/* Chat: local messages (last 1 hour) */
function loadMessages() {
  const msgs = JSON.parse(localStorage.getItem("messages") || "[]");
  const oneHour = 60 * 60 * 1000;
  const now = Date.now();
  const recent = msgs.filter((m) => now - (m.at || 0) <= oneHour);
  messagesEl.innerHTML = "";
  recent.forEach((m) => appendMessageToDOM(m.text, m.me, m.at));
  localStorage.setItem("messages", JSON.stringify(recent));
}
function appendMessageToDOM(text, me = false, at = Date.now()) {
  const el = document.createElement("div");
  el.className = "message " + (me ? "me" : "them");
  el.innerHTML = `<div>${text}</div><div class="message-time">${new Date(at).toLocaleTimeString()}</div>`;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
document.getElementById("sendChatBtn").addEventListener("click", () => {
  const text = chatInput.value.trim();
  if (!text) return;
  const at = Date.now();
  appendMessageToDOM(text, true, at);
  const msgs = JSON.parse(localStorage.getItem("messages") || "[]");
  msgs.push({ text, me: true, at });
  localStorage.setItem("messages", JSON.stringify(msgs));
  chatInput.value = "";
  setTimeout(() => {
    const replyAt = Date.now();
    appendMessageToDOM("Thanks — a mentor will reply soon.", false, replyAt);
    const msgs2 = JSON.parse(localStorage.getItem("messages") || "[]");
    msgs2.push({
      text: "Thanks — a mentor will reply soon.",
      me: false,
      at: replyAt,
    });
    localStorage.setItem("messages", JSON.stringify(msgs2));
  }, 900);
});
loadMessages();

/* Comments */
function loadComments() {
  const comments = JSON.parse(localStorage.getItem("comments") || "[]");
  commentsList.innerHTML = "";
  comments.forEach((c) => {
    const el = document.createElement("div");
    el.className = "card";
    el.style.marginBottom = "8px";
    el.innerHTML = `<div style="font-weight:700">${c.name || "User"}</div><div class="muted-small">${c.text}</div>`;
    commentsList.appendChild(el);
  });
}
document.getElementById("postComment").addEventListener("click", () => {
  const text = document.getElementById("commentText").value.trim();
  if (!text) return alert("Write a comment first");
  const comments = JSON.parse(localStorage.getItem("comments") || "[]");
  comments.push({ name: "Guest", text, at: Date.now() });
  localStorage.setItem("comments", JSON.stringify(comments));
  document.getElementById("commentText").value = "";
  loadComments();
});
loadComments();

/* Complaints */
document.getElementById("submitComplaint").addEventListener("click", () => {
  const text = document.getElementById("complaintText").value.trim();
  if (!text) return alert("Please describe your complaint");
  const complaints = JSON.parse(localStorage.getItem("complaints") || "[]");
  complaints.push({ text, at: Date.now() });
  localStorage.setItem("complaints", JSON.stringify(complaints));
  document.getElementById("complaintText").value = "";
  alert("Complaint submitted (local).");
});

/* Sign-in (simulated) */
document.getElementById("signInBtn").addEventListener("click", openSignInModal);
function openSignInModal() {
  const html = `<div style="display:grid;gap:10px">
    <input id="siPhone" placeholder="Mobile number" style="padding:10px;border-radius:10px;border:1px solid #eee">
    <div style="display:flex;gap:8px">
      <button class="btn" id="sendOtpBtn">Send OTP</button>
      <button class="btn ghost" id="emailSignBtn">Email</button>
    </div>
    <div id="otpArea" style="display:none;gap:8px">
      <input id="otpInput" placeholder="Enter OTP" style="padding:10px;border-radius:10px;border:1px solid #eee">
      <button class="btn" id="verifyOtpBtn">Verify</button>
    </div>
  </div>`;
  showModal("Sign In", html);
  document.getElementById("sendOtpBtn").addEventListener("click", () => {
    const phone = document.getElementById("siPhone").value.trim();
    if (!phone) return alert("Enter mobile number");
    document.getElementById("otpArea").style.display = "flex";
    sessionStorage.setItem("lk_temp_phone", phone);
    alert("OTP sent (simulated). Use 123456 to verify.");
  });
  document.getElementById("verifyOtpBtn").addEventListener("click", () => {
    const otp = document.getElementById("otpInput").value.trim();
    const phone = sessionStorage.getItem("lk_temp_phone") || "";
    if (otp === "123456") {
      const user = { name: "User " + phone.slice(-4), phone };
      localStorage.setItem("lk_user", JSON.stringify(user));
      showSignedIn(user);
      closeModal();
    } else alert("Invalid OTP (use 123456 in demo).");
  });
  document.getElementById("emailSignBtn").addEventListener("click", () => {
    modalBody.innerHTML = `<div style="display:grid;gap:8px"><input id="siEmail" placeholder="Email" style="padding:10px;border-radius:10px;border:1px solid #eee"><input id="siPass" placeholder="Password" type="password" style="padding:10px;border-radius:10px;border:1px solid #eee"><div style="display:flex;gap:8px"><button class="btn" id="emailSignInBtn">Sign in</button><button class="btn ghost" id="backBtn">Back</button></div></div>`;
    document.getElementById("emailSignInBtn").addEventListener("click", () => {
      const email = document.getElementById("siEmail").value.trim();
      if (!email) return alert("Enter email");
      const user = { name: email.split("@")[0], email };
      localStorage.setItem("lk_user", JSON.stringify(user));
      showSignedIn(user);
      closeModal();
    });
    document
      .getElementById("backBtn")
      .addEventListener("click", openSignInModal);
  });
}
function showSignedIn(user) {
  const signInBtn = document.getElementById("signInBtn");
  signInBtn.style.display = "none";
  const nav = document.querySelector("nav");
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.gap = "10px";
  container.innerHTML = `<div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#e6fff0,#dff7ea);display:flex;align-items:center;justify-content:center;color:var(--growth);font-weight:700">${(
    user.name || "U"
  )
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join(
      "",
    )}</div><div style="font-weight:700">${user.name}</div><button class="btn ghost" id="signOutBtn">Sign out</button>`;
  nav.appendChild(container);
  document.getElementById("signOutBtn").addEventListener("click", () => {
    localStorage.removeItem("lk_user");
    location.reload();
  });
}
(function restoreSignedIn() {
  const user = JSON.parse(localStorage.getItem("lk_user") || "null");
  if (user) showSignedIn(user);
})();

/* Reveal observer */
document.addEventListener("DOMContentLoaded", () => {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
  document.querySelectorAll(".issue-card").forEach((el) => obs.observe(el));
  document.querySelectorAll(".service-card").forEach((el) => obs.observe(el));
  document.querySelectorAll(".team-card").forEach((el) => obs.observe(el));
});
