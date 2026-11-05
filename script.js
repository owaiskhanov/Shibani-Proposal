/* ==========================================================================
   SAYS SKINN — Dermatology & Aesthetics | Interactive UI & Proposal Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Treatment Category Filter Tabs (Landing Page)
  const filterTabs = document.querySelectorAll('.filter-tab');
  const treatmentCards = document.querySelectorAll('.treatment-card');

  if (filterTabs.length > 0 && treatmentCards.length > 0) {
    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const selectedCategory = tab.getAttribute('data-filter');

        filterTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        treatmentCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          if (selectedCategory === 'all' || cardCategory === selectedCategory) {
            card.removeAttribute('hidden');
          } else {
            card.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  // 3. Pre-fill Treatment Selection from Treatment Cards
  const treatmentBookBtns = document.querySelectorAll('.treatment-book-btn');
  const treatmentSelect = document.getElementById('treatmentSelect');
  const contactSection = document.getElementById('contact');
  const patientNameInput = document.getElementById('patientName');

  if (treatmentBookBtns.length > 0 && treatmentSelect && contactSection) {
    treatmentBookBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTreatment = btn.getAttribute('data-treatment');
        if (targetTreatment) {
          Array.from(treatmentSelect.options).forEach((opt) => {
            if (opt.value === targetTreatment) {
              treatmentSelect.value = targetTreatment;
            }
          });
        }
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          if (patientNameInput) patientNameInput.focus({ preventScroll: true });
        }, 450);
      });
    });
  }

  // 4. Set Default Min Date on Appointment Date Picker
  const preferredDayInput = document.getElementById('preferredDay');
  if (preferredDayInput) {
    const todayStr = new Date().toISOString().split('T')[0];
    preferredDayInput.setAttribute('min', todayStr);
    preferredDayInput.value = todayStr;
  }

  // 5. Consultation Form Submission + WhatsApp Routing
  const consultationForm = document.getElementById('consultationForm');
  const formFeedback = document.getElementById('formFeedback');

  if (consultationForm && formFeedback) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('patientName')?.value.trim() || '';
      const phone = document.getElementById('patientPhone')?.value.trim() || '';
      const concern = document.getElementById('treatmentSelect')?.value || 'General Consultation';
      const date = document.getElementById('preferredDay')?.value || 'Flexible';
      const slot = document.getElementById('preferredSlot')?.value || 'Flexible';
      const notes = document.getElementById('patientNotes')?.value.trim() || '';

      const messageLines = [
        `Hello Says Skinn Clinic, I would like to book a consultation with Dr. Shibani Bhatia.`,
        `• Name: ${name}`,
        `• Phone: ${phone}`,
        `• Concern: ${concern}`,
        `• Preferred Date: ${date} (${slot})`,
      ];
      if (notes) {
        messageLines.push(`• Notes: ${notes}`);
      }

      const waUrl = `https://wa.me/919324463537?text=${encodeURIComponent(messageLines.join('\n'))}`;

      formFeedback.innerHTML = `Thank you, <strong>${escapeHtml(name)}</strong>! Your consultation request for <strong>${escapeHtml(concern)}</strong> is ready. <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline; margin-left:6px;">Open WhatsApp to send instantly →</a>`;
      formFeedback.classList.add('visible');
    });
  }

  // 6. Proposal Page Interactive Call-Lead Value Estimator
  const callsSlider = document.getElementById('callsSlider');
  const callsCountLabel = document.getElementById('callsCountLabel');
  const estConsultRev = document.getElementById('estConsultRev');
  const estProcRev = document.getElementById('estProcRev');
  const estTotalRev = document.getElementById('estTotalRev');

  if (callsSlider && callsCountLabel && estConsultRev && estProcRev && estTotalRev) {
    const formatINR = (num) => '₹' + Number(num).toLocaleString('en-IN');

    const updateEstimate = () => {
      const patients = parseInt(callsSlider.value, 10) || 30;
      const consultRevenue = patients * 1000;
      const procedureRevenue = Math.round(patients * 0.25 * 4500);
      const totalValue = consultRevenue + procedureRevenue;

      callsCountLabel.textContent = `${patients} Patients / mo`;
      estConsultRev.textContent = `${formatINR(consultRevenue)} / mo`;
      estProcRev.textContent = `${formatINR(procedureRevenue)} / mo`;
      estTotalRev.textContent = `${formatINR(totalValue)} / mo`;
    };

    callsSlider.addEventListener('input', updateEstimate);
    updateEstimate();
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
