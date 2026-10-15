document.addEventListener("DOMContentLoaded", function () {
  const modalClose = document.querySelectorAll(".modal-close");
  let isModalOpen = false;
  let currentOpenModal = null;
  let lastScrollPosition = 0;

  const closeModal = () => {
    if (currentOpenModal) {
      currentOpenModal.classList.remove("active");
      document.body.style.overflow = "";
      isModalOpen = false;
      currentOpenModal = null;
    }
  };

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    isModalOpen = true;
    currentOpenModal = modal;
    lastScrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;

    const galleryMain = modal.querySelector(".gallery-main img");
    const thumbnails = modal.querySelectorAll(".thumb");

    if (galleryMain && thumbnails.length > 0) {
      thumbnails.forEach((thumb) => {
        thumb.addEventListener("click", function () {
          thumbnails.forEach((t) => t.classList.remove("active"));
          this.classList.add("active");
          galleryMain.src = this.src;
          galleryMain.alt = this.alt;
        });
      });
    }
  };

  // Asignar apertura a cada tarjeta por data-modal o por mapeo de id
  const projectCards = document.querySelectorAll(".proyecto-card");
  projectCards.forEach((card) => {
    card.addEventListener("click", () => {
      const modalId = card.getAttribute("data-modal");
      if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) openModal(modal);
      } else {
        // Fallback por ID si no tiene data-modal
        const id = card.id ? card.id.replace("proyecto-", "") + "-modal" : null;
        if (id) {
          const modal = document.getElementById(id);
          if (modal) openModal(modal);
        }
      }
    });
  });

  modalClose.forEach((closeBtn) => {
    closeBtn.addEventListener("click", closeModal);
  });

  // Cerrar al hacer clic fuera del contenido en cualquier modal
  const allModals = document.querySelectorAll(".proyecto-modal");
  allModals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isModalOpen) {
      closeModal();
    }
  });

  window.addEventListener(
    "wheel",
    function (e) {
      if (isModalOpen) {
        const delta = Math.sign(e.deltaY);
        if (delta !== 0) {
          closeModal();
        }
      }
    },
    { passive: true }
  );

  let touchStartY = 0;
  window.addEventListener(
    "touchstart",
    function (e) {
      if (isModalOpen) {
        touchStartY = e.touches[0].clientY;
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    function (e) {
      if (isModalOpen) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchY - touchStartY;
        if (Math.abs(deltaY) > 10) {
          closeModal();
        }
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "scroll",
    function () {
      if (isModalOpen) {
        const currentScroll =
          window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(currentScroll - lastScrollPosition) > 5) {
          closeModal();
        }
      }
    },
    { passive: true }
  );
});
