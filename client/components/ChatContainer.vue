<template>
  <div class="container">
    <div
      v-if="conversation && conversation.length"
      class="messages"
      id="scroll"
    >
      <message
        v-for="message in conversation"
        :key="message.id"
        :content="message.content"
        :from="message.from"
      ></message>
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
  watch: {
    conversation: {
      handler: function (val) {
        this.scrollDown();
      },
      deep: true,
    },
  },
  methods: {
    handleSend(input) {
      this.$emit("send", input);
      this.$nextTick(() => {
        this.scrollDown();
      });
    },
    focus() {
      this.$refs.input.focus();
    },
    scrollDown() {
      try {
        var container = this.$el.querySelector("#scroll");
        container.scrollTop = container.scrollHeight;
      } catch (err) {}
    },
  },
  mounted() {
    this.scrollDown();
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
