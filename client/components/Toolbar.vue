<template>
  <div class="toolbar">
    <span class="welcome" @click="handleClick">GG Chat</span>
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>

<style>
.toolbar {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 10px;
  line-height: 10px;
}

.welcome {
  cursor: pointer;
}

@media only screen and (max-width: 899px) {
  .toolbar {
    padding-left: 30px;
  }
}
</style>
