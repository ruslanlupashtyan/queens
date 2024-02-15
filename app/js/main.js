let voteButtons = document.querySelectorAll(".participants .vote-btn");
console.log(voteButtons);
voteButtons.forEach((el) => {
  el.addEventListener("click", function () {
    voteButtons.forEach((i) => {
      i.classList.remove("active");
    });
    el.classList.add("active");
  });
});
