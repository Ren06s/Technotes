document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector('.container');
  const regBtn = document.querySelector('#toggleBtnReg');
  const loginBtn = document.querySelector('#toggleBtnLogin');

  if (regBtn && loginBtn && container) {
    regBtn.addEventListener('click', () => {
      container.classList.add('active');
    });

    loginBtn.addEventListener('click', () => {
      container.classList.remove('active');
    });
  } else {
    console.error("No se encontraron uno o más elementos en el DOM");
  }
});
