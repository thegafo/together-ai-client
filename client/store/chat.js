import { submitPrompt } from "~/api/together";

const defaults = {
  systemPrompt: 'The following is a text conversation between a user and a helpful assistant.'
}

export const state = () => ({
  loading: false,
  systemPrompt: defaults.systemPrompt,
  conversationId: 'initial',
  conversations: {
    'initial': [],
  }, // { id: [{ id, content, from}] }
  titles: {}, // { id: title }
});

export const getters = {
  loading: state => state.loading,
  systemPrompt: state => state.systemPrompt,
  conversationId: state => state.conversationId,
  conversations: state => state.conversations,
  titles: state => state.titles,
}

export const mutations = {
  setState(state, { conversations, titles, conversationId, systemPrompt }) {
    state.conversations = conversations;
    state.titles = titles;
    state.conversationId = conversationId;
    state.systemPrompt = systemPrompt;
  },
  addConversation(state) {
    const id = new Date().toISOString();
    state.conversations = {
      [id]: [],
      ...state.conversations,
    };
    state.conversationId = id;
    return id;
  },
  removeChat(state, { id }) {
    delete state.conversations[id];
    delete state.titles[id];
    state.conversations = { ...state.conversations };
  },
  setConversationId(state, { id }) {
    state.conversationId = id;
  },
  setTitle(state, { id, title }) {
    state.titles = {
      [id]: title,
      ...state.titles,
    }
  },
  addMessage(state, { id, content, from }) {
    state.conversations[id] = [
      ...state.conversations[id],
      {
        id: state.conversations[id]?.length + 1 || 1,
        content,
        from,
      },
    ]
  },
  appendMessage(state, { id, content }) {
    state.conversations[id][state.conversations[id].length - 1].content += content;
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  setSystemPrompt(state, systemPrompt) {
    state.systemPrompt = systemPrompt;
  }
}

export const actions = {
  newChat({ commit, state, dispatch }) {
    commit("addConversation");
    dispatch("saveHistory");
  },
  removeChat({ commit, state, dispatch }, { id }) {
    commit("removeChat", { id });
    if (state.conversationId === id) {
      if (Object.keys(state.conversations).length == 0) {
        commit("addConversation");
      } else {
        const newConversationId = Object.keys(state.conversations)[0];
        commit("setConversationId", { id: newConversationId });
      }

    }
    dispatch("saveHistory");
  },
  send({ commit, state, dispatch }, { id, content }) {
    return new Promise((resolve, reject) => {
      commit("addMessage", {
        id,
        content,
        from: "User",
      });

      commit("setLoading", true);

      let prompt = `[INST]\n${state.systemPrompt}\n\n`;
      let history = '';
      for (let i = 0; i < state.conversations[id].length; i++) {
        history += `${state.conversations[id][i].from}: ${state.conversations[id][i].content}\n`;
      }

      // keep last X characters of history
      prompt += history.slice(-3000);
      prompt += 'Assistant:[/INST]';

      let completion = '';
      submitPrompt(prompt).on('data', (str) => {
        if (!completion) {
          commit("addMessage", {
            id,
            content: str,
            from: "Assistant",
          });
          completion += str
          return;
        }
        commit("appendMessage", {
          id,
          content: str,
        });
      }).on('end', () => {
        commit("setLoading", false);
        if (!state.titles[id] && state.conversations[id].length >= 3) {
          dispatch("generateTitle", { id })
        }
        dispatch("saveHistory");
        resolve();
      }).on('error', (err) => {
        console.error("Error occurred:", err);
        commit("setLoading", false);
        reject(err);
      });
    })
  },
  generateTitle({ state, commit, dispatch }, { id }) {
    return new Promise((resolve, reject) => {
      commit("setLoading", true);

      let prompt = `[INST]\nGenerate ONE short title for the following conversation. Do not explain your logic.\n\nConversation:\n\n`;
      let history = '';
      for (let i = 0; i < state.conversations[id].length; i++) {
        history += `${state.conversations[id][i].from}: ${state.conversations[id][i].content}\n`;
      }
      // add first 1000 characters to prompt
      prompt += history.slice(0, 1000);
      prompt += '\n\nTitle:[/INST]\n';

      let title = '';

      submitPrompt(prompt).on('data', (str) => {
        title += str;
      }).on('end', () => {
        commit("setLoading", false);
        commit("setTitle", {
          id,
          title,
        });
        dispatch("saveHistory");
        resolve(title);
      }).on('error', (err) => {
        console.error("Error occurred:", err);
        commit("setLoading", false);
        reject(err);
      });
    });
  },
  resetSettings({ commit, dispatch }) {
    commit("setSystemPrompt", defaults.systemPrompt);
    dispatch("saveHistory");
  },
  saveSettings({ commit, dispatch }, { systemPrompt }) {
    commit("setSystemPrompt", systemPrompt);
    dispatch("saveHistory");
  },
  saveHistory({ state }) {
    localStorage.setItem('local-history', JSON.stringify({
      conversations: state.conversations,
      titles: state.titles,
      conversationId: state.conversationId,
      systemPrompt: state.systemPrompt,
    }));
  },
  loadHistory({ state, commit }) {
    const history = JSON.parse(localStorage.getItem('local-history'));
    if (!history) {
      return;
    }
    commit("setState", history);
  },
}