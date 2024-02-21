<template>
  <section class="section participants container">
    <h2 class="large-title participants__title">Наші фіналістки</h2>
    <div class="participants__items flex wrap jc-center">
      <CandidateComponent
        v-for="(candidate, i) in candidates"
        :key="candidate.id"
        :candidate="candidate"
        :index="i"
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

import CandidateComponent from "./CandidateComponent.vue";

const candidates = ref([]);

onMounted(async () => {
  candidates.value = await (
    await axios.get("https://beauty-contest2.azurewebsites.net/api/candidates")
  ).data.results;
});
</script>
