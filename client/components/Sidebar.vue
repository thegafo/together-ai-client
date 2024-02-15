<template>
  <div class="sidebar">
    <div class="sidebar-items">
      <div @click="newChat" class="sidebar-item">New Chat +</div>
      <div
        class="sidebar-item"
        v-for="id in Object.keys(conversations)"
        :key="id"
        @click="selectConversation(id)"
        :class="{ current: selectedId === id }"
      >
        <div class="sidebar-item-title">
          {{ titles[id] || "Untitled" }}
        </div>
        <div class="sidebar-item-delete-container">
          <div class="sidebar-item-delete" @click.prevent="removeChat(id)">
            🗑️
          </div>
        </div>
      </div>
    </div>

    <div class="sidebar-footer">
      <button class="icon-button" @click="$refs.modal.open()">
        <img class="icon" src="/settings.svg" alt="Settings" />
      </button>
      <modal ref="modal">
        <settings @close="$refs.modal.close()"></settings>
      </modal>
    </div>
  </div>
</template>

<script>
import Modal from "./Modal.vue";
import Settings from "./Settings.vue";
export default {
  components: { Modal, Settings },
  name: "Sidebar",
  props: {
    conversations: Object,
    titles: Object,
    selectedId: String,
  },
  methods: {
    selectConversation(id) {
      this.$emit("selectConversation", id);
    },
    newChat() {
      this.$emit("newChat");
    },
    removeChat(id) {
      this.$emit("removeChat", id);
    },
  },
};
</script>

<style scoped>
.sidebar {
  height: 100%;
  width: 260px;
  min-width: 260px;
  background: var(--sidebar-color);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 12px;
  display: flex;
  flex-direction: column;
}

.sidebar::-webkit-scrollbar {
  /* Chrome, Safari, and Opera */
  display: none;
}

.sidebar-items {
  flex-grow: 1;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.sidebar-item {
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  font-size: 11px;
}

.sidebar-item:hover {
  background-color: var(--highlight-color);
}

.sidebar-item-title {
  flex-grow: 1;
}

.sidebar-item-delete-container {
  width: 30px;
}

.sidebar-item-delete {
  display: none;
  float: right;
  font-size: 8px;
}

.sidebar-item:hover > .sidebar-item-delete-container > .sidebar-item-delete {
  display: inline-block;
}

.current {
  background-color: var(--highlight-color);
}

@media only screen and (max-width: 1000px) {
  .sidebar {
    display: none;
  }
}

.icon {
  width: 15px;
  filter: invert(100%);
  opacity: 0.5;
}

.icon:hover {
  opacity: 1;
}

.icon-button {
  float: right;
  padding: 10px;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
  background: var(--sidebar-color);
  color: var(--text-color);
  outline: none;
  border: none;
}
</style>
