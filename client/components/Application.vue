<template>
  <div class="app">
    <sidebar
      v-if="showSidebar"
      :conversations="conversations"
      :titles="titles"
      :selectedId="id"
      @selectConversation="handleItemSelected"
      @newChat="handleNewChat"
      @deleteChat="handleDeleteChat"
    />
    <spacer @click="toggleSidebar" :spacerText="showSidebar ? '\|' : '>'" />
    <div class="main">
      <toolbar @click="handleNewChat" />
      <chat-container
        ref="chat"
        :loading="loading"
        :conversation="conversations[id] || []"
        @send="handleSend"
      ></chat-container>
    </div>
    <spacer :spacerText="''" />
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import Spacer from "./Spacer.vue";
import Toolbar from "./Toolbar.vue";
import ChatContainer from "./ChatContainer.vue";

export default {
  name: "Application",
  components: {
    Sidebar,
    Spacer,
    Toolbar,
    ChatContainer,
  },
  data() {
    return {
      id: "12345",
      loading: false,
      input: null,
      showSidebar: true,
      conversations: {
        12345: [
          {
            id: 1,
            content: "Hey!",
            from: "User",
          },
          {
            id: 2,
            content: "Hello, world!",
            from: "Assistant",
          },
        ],
      },
      titles: {
        12345: "Hello World",
      },
    };
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    handleItemSelected(id) {
      this.id = id;
    },
    handleNewChat() {
      this.id = new Date().toISOString();
      this.conversations = {
        [this.id]: [],
        ...this.conversations,
      };
      this.$forceUpdate();
    },
    handleDeleteChat(id) {
      delete this.conversations[id];
      delete this.titles[id];
      if (Object.keys(this.conversations).length == 0) {
        this.handleNewChat();
      } else {
        this.id = Object.keys(this.conversations)[0];
      }
      this.$forceUpdate();
    },
    handleSend(input) {
      if (!input) {
        return;
      }
      this.conversations[this.id].push({
        content: input,
        from: "User",
      });
      this.submitPrompt();
    },
    submitPrompt() {},
    focus() {
      this.$refs.chat.focus();
    },
  },
  mounted() {
    this.focus();
  },
};
</script>

<style>
:root {
  --background-color: rgb(52, 53, 65);
  --text-color: white;
  --sidebar-color: #040404;
  --highlight-color: rgba(2, 39, 75, 1);
  --user-color: rgba(2, 39, 75, 0.3);
  --assistant-color: rgba(8, 82, 86, 0.3);
}

html,
body {
  background: var(--background-color);
  color: var(--text-color);
  font-family: "Roboto Mono", monospace;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 0;
  font-size: 14px;
}

.app {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: var(--background-color);
  align-items: space-between;
}

.main {
  max-height: 100vh;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
