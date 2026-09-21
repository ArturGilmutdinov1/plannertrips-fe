<template>
  <UPageHeader :title="name" :description="country.label" />
  <UPageBody> </UPageBody>
</template>

<script setup lang="ts">
const tripModalStore = useTripModalStore();

const { name, country } = tripModalStore;

console.log(country);
</script>

<style></style>
