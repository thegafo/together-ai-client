<template>
  <div :class="['message', from === 'User' ? 'user' : 'assistant']">
    <!--pre>{{ content.trim() }}</pre-->
    <!-- TODO -->
    <div v-html="formattedContent"></div>
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
  padding-top: 25px;
  padding-bottom: 25px;
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
  margin-top: -5px;
  margin-bottom: -15px;
}

code {
  background-color: rgba(0, 0, 0, 0.1); /* Light grey background */
  display: block; /* Block display */
  overflow-x: auto; /* Horizontal scrolling for long lines */
  padding: 15px;
  border-radius: 5px;
}
</style>
