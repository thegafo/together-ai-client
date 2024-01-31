<template>
  <div class="input-container">
    <textarea
      ref="input"
      v-model="input"
      :disabled="loading"
      @keydown="handleKeydown"
      @input="autogrow"
      @focus="autogrow"
      :placeholder="loading ? 'Loading...' : 'Message...'"
      rows="1"
    ></textarea>
  </div>
</template>

<script>
export default {
  name: "InputContainer",
  props: {
    loading: Boolean,
  },
  data() {
    return {
      input: "",
    };
  },
  methods: {
    handleKeydown(event) {
      if (!this.input.trim()) return;
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        this.$emit("send", this.input);
        this.input = "";
      }
      this.$nextTick(() => {
        this.autogrow();
      });
    },
    autogrow() {
      const maxHeight = 300;
      this.$refs.input.style.height = "auto"; // Reset the height
      const newHeight = Math.min(this.$refs.input.scrollHeight, maxHeight);
      this.$refs.input.style.height = newHeight + "px"; // Set the height
      this.$refs.input.overflowY =
        newHeight === maxHeight ? "scroll" : "hidden";
    },
    focus() {
      this.$refs.input.focus();
    },
  },
  mounted() {
    this.autogrow();
  },
};
</script>

<style>
.input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: calc(100% - 20px);
  margin-bottom: 5px;
}

textarea {
  background-color: transparent;
  color: var(--text-color);
  resize: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  outline: none;
  flex-grow: 1;
  max-height: 300px;
  border-radius: 10px;
  font-family: "Roboto Mono", monospace;
  font-size: 14px;
  min-height: 62px;
  margin: none;
  padding: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
  box-sizing: border-box;
}
</style>
