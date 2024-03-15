<template>
  <div class="item">
    <img class="item__image image" :src="candidate.imageUrl" alt="" />
    <div class="item__title">{{ candidate.fullName }}</div>
    <div class="item__count">{{ candidate.voteCount }}</div>
    <div class="item__descr">
      <p v-html="candidate.description"></p>
    </div>
    <div class="item__pay pay flex">
      <div
        class="pay__count voteCount.value flex"
        style="gap: 8px; margin-right: 12px"
      >
        <div class="count__minus minus" @click="minus">
          <p>-</p>
        </div>
        <div class="count__value value">
          <p>{{ voteCount }}</p>
        </div>
        <div class="count__plus plus" @click="plus">
          <p>+</p>
        </div>
      </div>
      <div class="pay__price price">
        <p>{{ total }}</p>
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
    <a :href="candidate.link" target="_blank" class="item__btn vote-btn">
      <p class="vot">Проголосувати</p>
      <p class="conf" @click="vote">
        <span v-if="loading">Підтверджуємо...</span>
        <span v-else>Підтвердити</span>
      </p>
    </a>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, defineProps, onMounted, ref } from "vue";

const loading = ref(false);
const props = defineProps(["candidate", "index"]);
const voteCount = ref(1);
const price = 30;
const total = computed(() => voteCount.value * price);

onMounted(() => {
  addHandlers();
});

const plus = () => {
  if (voteCount.value <= 1000) voteCount.value++;
};

const minus = () => {
  if (voteCount.value <= 1) return;
  voteCount.value--;
};

const vote = async () => {
  loading.value = true;
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
  // voteButtons.forEach((el) => {
  //   el.addEventListener("click", function () {
  //     voteButtons.forEach((i) => {
  //       i.classList.remove("active");
  //     });
  //     el.classList.add("active");
  //   });
  // });

  let closeButtons = document.querySelectorAll(".participants .close");
  closeButtons.forEach((el) => {
    el.addEventListener("click", function () {
      let item = el.closest(".item");
      let btn = item.querySelector(".vote-btn");
      console.log(btn);
      el.closest(".item").querySelector(".vote-btn").classList.remove("active");
    });
  });
};
</script>

<style lang="scss" scoped>
$green: #008744;
$blue: #0057e7;
$red: #d62d20;
$yellow: #ffa700;
$white: #eee;

$width: 100px;

body {
  background-color: white;
}

.loader {
  position: absolute;
  width: $width;
  height: $width;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.circular {
  animation: rotate 2s linear infinite;
  height: $width;
  position: relative;
  width: $width;
}

.path {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke: #b6463a;
  animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke-linecap: round;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
}
@keyframes color {
  100%,
  0% {
    stroke: $red;
  }
  40% {
    stroke: $blue;
  }
  66% {
    stroke: $green;
  }
  80%,
  90% {
    stroke: $yellow;
  }
}
</style>
