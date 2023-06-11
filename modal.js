document.addEventListener("DOMContentLoaded", ()=>{
    const modal = document.querySelector('.modal');
    const openBtn = document.querySelector('.openBtn');
    const closeBtn = document.querySelector('.closeBtn');

    openBtn.addEventListener('click', ()=>{
        modal.showModal();
    });

    closeBtn.addEventListener('click', ()=>{
        modal.close();
    });
});