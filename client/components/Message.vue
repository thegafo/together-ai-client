<template>
  <div :class="['message', from === 'User' ? 'user' : 'assistant']">
    <pre>{{ content.trim() }}</pre>
    <!-- TODO -->
    <!--div v-html="formattedContent"></div-->
  </div>
</template>

<script>
export default {
  name: "Message",
  props: {
    content: String,
    from: String,
  },
  computed: {
    formattedContent() {
      return this.formatCodeBlocks(this.content);
    },
  },
  methods: {
    formatCodeBlocks(str) {
      let regex = /^```.*?\n[\s\S]+?```$/gm;
      let match;
      while ((match = regex.exec(str))) {
        let code = match[0]
          .replace(/^```.*?\n/, "")
          .replace(/```$/, "")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        let htmlCode = `<pre><code>${code}</code></pre>`;
        str = str.replace(match[0], htmlCode);
      }
      return str.replace(/\n/g, "<br>");
    },
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

pre code {
  font-family: "Roboto Mono", monospace; /* Monospaced font */
  background-color: black; /* Light grey background */
  padding: 10px; /* Padding around text */
  display: block; /* Block display */
  overflow-x: auto; /* Horizontal scrolling for long lines */
}
</style>
