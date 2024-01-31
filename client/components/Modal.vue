<template>
  <div v-if="isOpen" class="modal" @click="handleOutsideClick">
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    handleOutsideClick(event) {
      if (!this.$el.querySelector(".modal-content").contains(event.target)) {
        this.close();
      }
    },
  },
};
</script>

<style scoped>
.modal {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: hsla(0, 0%, 40%, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: var(--sidebar-color);
  color: var(--text-color);
  background: rgb(32, 33, 35);
  padding: 20px;
  border-radius: 10px;
  width: 680px;
  min-height: 400px;
  max-width: 100%;
  max-height: 100%;
}
</style>
