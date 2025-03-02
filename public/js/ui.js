// ui.js

export function initTabs() {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tabContents.forEach(tc => tc.classList.remove("active"));

            tab.classList.add("active");
            const tabId = tab.getAttribute("data-tab");
            document.getElementById(`${tabId}-tab`).classList.add("active");
        });
    });
}

export function toggleTheme() {
    const body = document.body;
    body.classList.toggle("dark-theme");
    const themeIcon = document.querySelector("#theme-toggle i");
    if (body.classList.contains("dark-theme")) {
         themeIcon.classList.remove("fa-moon");
         themeIcon.classList.add("fa-sun");
    } else {
         themeIcon.classList.remove("fa-sun");
         themeIcon.classList.add("fa-moon");
    }
}

export function initThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
         themeToggle.addEventListener("click", toggleTheme);
    }
}

export function showLoading() {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
         overlay.classList.remove("hidden");
    }
}

export function hideLoading() {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
         overlay.classList.add("hidden");
    }
}

export function showMessage(element, msg, type = "info") {
    if (element) {
         element.textContent = msg;
         element.className = "message " + type;
    }
}

export function togglePostsView(containerId, view = "list") {
    const container = document.getElementById(containerId);
    if (container) {
         if (view === "grid") {
              container.classList.remove("list-view");
              container.classList.add("grid-view");
         } else {
              container.classList.remove("grid-view");
              container.classList.add("list-view");
         }
    }
}

export function confirmAction(messageText) {
    return new Promise((resolve) => {
         const confirmModal = document.getElementById("confirmModal");
         const confirmMessage = document.getElementById("confirmMessage");
         const confirmOK = document.getElementById("confirmOK");
         const confirmCancel = document.getElementById("confirmCancel");

         if (confirmModal && confirmMessage && confirmOK && confirmCancel) {
              confirmMessage.textContent = messageText;
              confirmModal.classList.remove("hidden");

              const cleanup = () => {
                  confirmModal.classList.add("hidden");
                  confirmOK.removeEventListener("click", onConfirm);
                  confirmCancel.removeEventListener("click", onCancel);
              };

              const onConfirm = () => {
                  cleanup();
                  resolve(true);
              };

              const onCancel = () => {
                  cleanup();
                  resolve(false);
              };

              confirmOK.addEventListener("click", onConfirm);
              confirmCancel.addEventListener("click", onCancel);
         } else {
              resolve(false);
         }
    });
}
