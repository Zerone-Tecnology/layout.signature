// Universal Modal Manager
class ModalManager {
  constructor() {
    this.modals = {};
    this.init();
  }

  // Initialize all modals on the page
  init() {
    // Find all modal backdrops
    const modalBackdrops = document.querySelectorAll(".modal-backdrop-custom");

    modalBackdrops.forEach((backdrop) => {
      const modalId = backdrop.id;
      if (modalId) {
        this.modals[modalId] = backdrop;
        this.setupEventListeners(backdrop);
      }
    });
  }

  // Setup event listeners for a modal
  setupEventListeners(backdrop) {
    // Close on backdrop click
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        this.close(backdrop.id);
      }
    });

    // Close on back button click
    const backBtn = backdrop.querySelector(".back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        this.close(backdrop.id);
      });
    }

    // Handle form submission
    const form = backdrop.querySelector("form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSubmit(backdrop.id, form);
      });
    }

    // Setup toggle buttons if they exist
    this.setupToggleButtons(backdrop);
  }

  // Setup toggle buttons (for Yes/No selection)
  setupToggleButtons(backdrop) {
    const toggleButtons = backdrop.querySelectorAll(".toggle-btn");
    if (toggleButtons.length === 0) return;

    toggleButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active classes from all toggle buttons in this modal
        toggleButtons.forEach((b) => {
          b.classList.remove("active-yes", "active-no");
        });

        // Add appropriate active class to clicked button
        const isYes = btn.id === "btnYes" || btn.textContent.trim() === "Да";
        btn.classList.add(isYes ? "active-yes" : "active-no");

        // Store selection in data attribute
        backdrop.dataset.selectedOption = isYes ? "yes" : "no";
      });
    });

    // Set default selection
    const defaultBtn = backdrop.querySelector("#btnYes") || toggleButtons[0];
    if (defaultBtn) {
      defaultBtn.click();
    }
  }

  // Open a modal by ID
  open(modalId) {
    const modal = this.modals[modalId];
    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }
  }

  // Close a modal by ID
  close(modalId) {
    const modal = this.modals[modalId];
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = ""; // Restore scrolling
    }
  }

  // Handle form submission
  handleSubmit(modalId, form) {
    const modal = this.modals[modalId];
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Add toggle button selection if exists
    if (modal.dataset.selectedOption) {
      data.selectedOption = modal.dataset.selectedOption;
    }

    // Get all input values
    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      if (input.name) {
        data[input.name] = input.value;
      }
    });

    // Emit custom event with form data
    const event = new CustomEvent("modalSubmit", {
      detail: {
        modalId: modalId,
        data: data,
      },
    });
    document.dispatchEvent(event);

    // Close modal after submission
    this.close(modalId);

    return data;
  }

  // Close all modals
  closeAll() {
    Object.keys(this.modals).forEach((modalId) => {
      this.close(modalId);
    });
  }
}

// Initialize modal manager when DOM is ready
let modalManager;

document.addEventListener("DOMContentLoaded", () => {
  modalManager = new ModalManager();

  // Close modals with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modalManager.closeAll();
    }
  });

  // Listen for modal submit events
  document.addEventListener("modalSubmit", (e) => {
    console.log("Modal submitted:", e.detail);
    // Handle the submission data here
    // You can make API calls, show notifications, etc.
  });
});

// Convenience functions for opening modals
function openModal(modalId) {
  if (modalManager) {
    modalManager.open(modalId);
  }
}

function closeModal(modalId) {
  if (modalManager) {
    modalManager.close(modalId);
  }
}
