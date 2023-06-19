document.addEventListener("DOMContentLoaded", () => {
    const modal = document.querySelector('.modal');
    modal.showModal();
    const openBtn = document.querySelector('.openBtn');
    const closeBtn = document.querySelector('.closeBtn');
    const result_modal = document.querySelector('.result-modal');
    openBtn.addEventListener('click', () => {
        modal.showModal();
    });

    closeBtn.addEventListener('click', () => {
        modal.setAttribute('closing', "");
        modal.addEventListener('animationend', () => {
            modal.removeAttribute('closing');
            modal.close();
        }, { once: true });
    });
});