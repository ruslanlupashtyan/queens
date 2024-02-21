<template>
  <div class="item">
    <img class="item__image image" :src="candidate.imageUrl" alt="" />
    <div class="item__title">{{ candidate.fullName }}</div>
    <div class="item__count">{{ candidate.voteCount }}</div>
    <div class="item__descr">
      <p>
        {{ candidate.description }}
      </p>
    </div>
    <div class="item__pay pay flex">
      <div class="pay__count voteCount.value flex">
        <div class="count__minus minus">
          <p>-</p>
        </div>
        <div class="count__value value">
          <p>{{ voteCount }}</p>
        </div>
        <div class="count__plus plus">
          <p>+</p>
        </div>
      </div>
      <div class="pay__price price">
        <p>{{ price }}</p>
      </div>
      <div class="pay__close close flex ai-center jc-center">
        <svg
          width="6"
          height="7"
          viewBox="0 0 6 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.25855 3.50002L0.0863171 1.32778L0.787767 0.626334L2.96 2.79857L5.13223 0.626334L5.83368 1.32778L3.66145 3.50002L5.83368 5.67225L5.13223 6.3737L2.96 4.20147L0.787767 6.3737L0.0863169 5.67225L2.25855 3.50002Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
    <button class="item__btn vote-btn">
      <p class="vot">Проголосувати</p>
      <p class="conf" @click="vote">Підтвердити</p>
    </button>
  </div>
</template>

<script setup>
import axios from "axios";
import { defineProps, onMounted, ref } from "vue";

const props = defineProps(["candidate", "index"]);
const voteCount = ref(1);
const price = 30;

onMounted(() => {
  var element = document.getElementById("image" + props.candidate.id);
  if (element) element.style.backgroundImage = props.candidate.imageUrl;

  addHandlers();
});

const vote = async () => {
  const data = (
    await axios.post(
      "https://beauty-contest2.azurewebsites.net/api/candidates/vote",
      {
        votesCount: voteCount.value,
        candidateId: props.candidate.id,
      }
    )
  ).data;

  const responseData = data.data;
  const signature = data.signature;

  // Create a form element
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://www.liqpay.ua/api/3/checkout";
  form.acceptCharset = "utf-8";

  // Create hidden input for data
  const dataInput = document.createElement("input");
  dataInput.type = "hidden";
  dataInput.name = "data";
  dataInput.value = responseData;
  form.appendChild(dataInput);

  // Create hidden input for signature
  const signatureInput = document.createElement("input");
  signatureInput.type = "hidden";
  signatureInput.name = "signature";
  signatureInput.value = signature;
  form.appendChild(signatureInput);

  // Append the form to the document body
  document.body.appendChild(form);

  // Submit the form
  form.submit();
};

const addHandlers = () => {
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

    plus.addEventListener("click", function () {
      voteCount.value++;
      let total = price * voteCount.value;
      el.querySelector(".value p").innerHTML = voteCount.value;
      el.querySelector(".price p").innerHTML = total;
    });
    minus.addEventListener("click", function () {
      if (voteCount.value < 2) {
        return;
      } else {
        voteCount.value--;
        let total = price * voteCount.value;
        el.querySelector(".value p").innerHTML = voteCount.value;
        el.querySelector(".price p").innerHTML = total;
        console.log(voteCount.value);
      }
    });
  });
};
</script>
