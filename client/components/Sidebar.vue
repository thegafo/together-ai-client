<template>
  <div class="sidebar">
    <div @click="newChat" class="sidebar-item">New Chat</div>
    <div
      class="sidebar-item"
      v-for="id in Object.keys(conversations).reverse()"
      :key="id"
      @click="selectConversation(id)"
      :class="{ current: selectedId === id }"
    >
      <div class="sidebar-item-title">
        {{ titles[id] || "Untitled" }}
      </div>
      <div class="sidebar-item-delete-container">
        <div class="sidebar-item-delete" @click="deleteChat(id)">🗑️</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
    deleteChat(id) {
      this.$emit("deleteChat", id);
    },
  },
};
</script>

<style scoped>
.sidebar {
  height: 100%;
  width: 260px;
  background: var(--sidebar-color);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 12px;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.sidebar::-webkit-scrollbar {
  /* Chrome, Safari, and Opera */
  display: none;
}

.sidebar-item {
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-item:hover {
  background-color: var(--highlight-color);
}

.sidebar-item-delete-container {
  height: 20px;
}

.sidebar-item-delete {
  display: none;
}

.sidebar-item:hover > .sidebar-item-delete-container > .sidebar-item-delete {
  display: inline-block;
}

.current {
  background-color: var(--highlight-color);
}

@media only screen and (max-width: 899px) {
  .sidebar {
    display: none;
  }
}
</style>
