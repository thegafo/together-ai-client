<template>
  <div class="app">
    <sidebar
      v-if="showSidebar"
      :conversations="conversations"
      :titles="titles"
      :selectedId="conversationId"
      @selectConversation="handleItemSelected"
      @newChat="handleNewChat"
      @removeChat="handleRemoveChat"
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
import { mapGetters, mapMutations, mapActions } from "vuex";

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
  computed: {
    ...mapGetters({
      loading: "chat/loading",
      conversations: "chat/conversations",
      titles: "chat/titles",
      conversationId: "chat/conversationId",
    }),
    id() {
      return this.conversationId;
    },
  },
  data() {
    return {
      showSidebar: true,
    };
  },
  methods: {
    ...mapActions({
      send: "chat/send",
      newChat: "chat/newChat",
      removeChat: "chat/removeChat",
      loadHistory: "chat/loadHistory",
    }),
    ...mapMutations({
      setConversationId: "chat/setConversationId",
    }),
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    handleItemSelected(id) {
      this.setConversationId({ id });
      this.$nextTick(() => {
        this.scrollDown();
        this.focus();
      });
    },
    handleNewChat() {
      this.newChat();
    },
    handleRemoveChat(id) {
      this.removeChat({ id });
    },
    async handleSend(input) {
      if (!input.trim()) {
        return;
      }
      await this.send({
        id: this.id,
        content: input,
      });
      this.focus();
    },
    focus() {
      this.$refs.chat.focus();
    },
    scrollDown() {
      this.$refs.chat.scrollDown();
      this.$nextTick(() => {
        this.$refs.chat.scrollDown();
      });
    },
  },
  mounted() {
    this.loadHistory();
    this.focus();
    this.scrollDown();
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

* {
  font-family: "Roboto Mono", monospace;
}

html,
body {
  background: var(--background-color);
  color: var(--text-color);
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
