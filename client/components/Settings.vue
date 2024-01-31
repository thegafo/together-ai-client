<template>
  <div>
    <h1>Settings</h1>
    <p>System prompt:</p>
    <textarea
      class="settings-textarea"
      placeholder="System prompt..."
      v-model="system"
    ></textarea>
    <br />
    <button @click="save">Save</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Settings",
  computed: {
    ...mapGetters({
      systemPrompt: "chat/systemPrompt",
    }),
  },
  data() {
    return {
      system: null,
    };
  },
  methods: {
    save() {
      this.$store.dispatch("chat/saveSettings", {
        systemPrompt: this.system,
      });
      this.$emit("close");
    },
    reset() {
      this.$store.dispatch("chat/resetSettings");
      this.system = this.systemPrompt;
    },
  },
  mounted() {
    this.system = this.systemPrompt;
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 30px;
}
.settings-textarea {
  width: 100%;
  background-color: transparent;
  color: var(--text-color);
  resize: vertical;
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

button {
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 10px 20px 10px 20px;
  margin-top: 10px;
  cursor: pointer;
}

button:hover {
  background-color: var(--highlight-color);
}
</style>
