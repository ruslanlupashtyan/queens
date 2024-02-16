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

let closeButtons = document.querySelectorAll(".participants .close");
closeButtons.forEach((el) => {
  el.addEventListener("click", function () {
    let item = el.closest(".item");
    let btn = item.querySelector(".vote-btn");
    console.log(btn);
    el.closest(".item").querySelector(".vote-btn").classList.remove("active");
  });
});

let items = document.querySelectorAll(".participants .item");
items.forEach((el) => {
  let plus = el.querySelector(".plus");
  let minus = el.querySelector(".minus");
  let count = Number(el.querySelector(".value p").innerHTML);
  let price = Number(el.querySelector(".price p").innerHTML);

  plus.addEventListener("click", function () {
    count++;
    let total = price * count;
    el.querySelector(".value p").innerHTML = count;
    el.querySelector(".price p").innerHTML = total;
  });
  minus.addEventListener("click", function () {
    if (count < 2) {
      return;
    } else {
      count--;
      let total = price * count;
      el.querySelector(".value p").innerHTML = count;
      el.querySelector(".price p").innerHTML = total;
      console.log(count);
    }
  });
});
