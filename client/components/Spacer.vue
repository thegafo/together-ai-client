<template>
  <div class="spacer" @click="handleClick">
    {{ spacerText }}
  </div>
</template>

<script>
export default {
  name: "Spacer",
  props: ["spacerText"],
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped>
.spacer {
  position: relative;
  padding: 5px;
  top: 42.5%;
  cursor: pointer;
  opacity: 0.2;
  font-size: 20px;
  transition: opacity 0.5s ease;
  width: 10px;
  height: 20px;
}

.spacer:hover {
  opacity: 0.8;
}

@media only screen and (max-width: 899px) {
  .spacer {
    display: none;
  }
}
</style>
