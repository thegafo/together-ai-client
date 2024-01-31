<template>
  <div :class="['message', type === 'user' ? 'user' : 'assistant']">
    <pre>{{ text }}</pre>
  </div>
</template>

<script>
export default {
  name: "Message",
  props: {
    text: String,
    type: String,
  },
};
</script>

<style>
.message {
  width: calc(100% - 40px);
  background: var(--highlight-color);
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  color: white;
}

.user {
  background-color: var(--user-color);
}

.assistant {
  background-color: var(--assistant-color);
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-x: auto;
  font-family: "Roboto Mono", monospace;
}
</style>
