<template>
  <div class="container">
    <div
      v-if="conversation && conversation.length"
      class="messages"
      id="scroll"
    >
      <div
        :class="['message', message.from === 'User' ? 'user' : 'assistant']"
        v-for="message in conversation"
        :key="message.id"
      >
        <pre v-if="message.content" v-text="message.content.trim()"></pre>
      </div>
    </div>
    <welcome v-else />
    <input-container ref="input" @send="handleSend" :loading="loading" />
  </div>
</template>

<script>
import Toolbar from "./Toolbar.vue";
import Message from "./Message.vue";
import InputContainer from "./InputContainer.vue";
import Welcome from "./Welcome.vue";

export default {
  name: "ChatContainer",
  components: {
    Toolbar,
    Message,
    InputContainer,
    Welcome,
  },
  props: {
    conversation: Array,
    loading: Boolean,
  },
  methods: {
    handleSend(input) {
      this.$emit("send", input);
    },
    focus() {
      this.$refs.input.focus();
    },
  },
};
</script>

<style>
.container {
  display: flex;
  background: var(--background-color);
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 50px);
  width: 700px;
  max-width: 100vw;
}

.messages {
  flex-grow: 1;
  overflow-y: scroll;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-width: 100%;
}

.messages::-webkit-scrollbar {
  display: none;
}
</style>
