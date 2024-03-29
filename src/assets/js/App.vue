<template>
  <div :class="{ 'translator-wraper': true, hidden: hidden }">
    <el-tabs class="main-card" type="card">
      <el-tab-pane label="Learners">
        <el-row class="translation-item">
          <el-input
            v-model="additionalMeaning"
            placeholder="Additional Meaning"
          ></el-input>
        </el-row>
        <el-row
          class="translation-item"
          v-for="(item, index) in learners"
          :key="index"
          @click.native="itemClicked(item)"
          :style="`background-color:${isIncluesSeleted(item) ? '#98e8f5' : ''}`"
        >
          <span v-html="item"></span>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Examples">
        <el-row class="translation-item">
          <el-input
            v-model="additionalExample"
            placeholder="Additional Example"
          ></el-input>
        </el-row>
        <el-row
          class="translation-item"
          v-for="(item, index) in examples"
          :key="index"
          @click.native="itemClicked(item)"
          :style="`background-color:${isIncluesSeleted(item) ? '#98e8f5' : ''}`"
        >
          <span v-html="item"></span>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Meanings">
        <el-row class="translation-item">
          <el-input v-model="category" placeholder="Category"></el-input>
        </el-row>
        <el-row
          class="translation-item"
          v-for="(item, index) in meanings"
          :key="index"
          @click.native="itemClicked(item)"
          :style="`background-color:${isIncluesSeleted(item) ? '#98e8f5' : ''}`"
        >
          <span v-html="item"></span>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-button
      :class="{ 'save-button': true, loading: isLoading }"
      type="success"
      @click="save"
      >Save</el-button
    >
    <el-button class="close-button" type="danger" circle @click="close"
      >X</el-button
    >
  </div>
</template>

<script>
import StorageService from "../../services/StorageService";
import {
  Tabs,
  TabPane,
  Row,
  Checkbox,
  CheckboxGroup,
  Button,
  Input,
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
export default {
  components: {
    "el-tabs": Tabs,
    "el-tab-pane": TabPane,
    "el-row": Row,
    "el-checkbox": Checkbox,
    "el-checkbox-group": CheckboxGroup,
    "el-button": Button,
    "el-input": Input,
  },
  props: ["translation"],
  data() {
    return {
      activeName: "first",
      items: [],
      additionalMeaning: "",
      additionalExample: "",
      category: "Lingemy",
      localTranslation: this.translation,
      hidden: false,
      isLoading: false,
      lastCategoryKey: "ul-category",
    };
  },
  computed: {
    learners() {
      return this.localTranslation.learners;
    },
    examples() {
      return this.localTranslation.examples;
    },
    meanings() {
      return this.localTranslation.meanings;
    },
  },
  mounted() {
    chrome.runtime.onMessage.addListener((request, sender) => {
      if (request.type === "updateRes") {
        this.isLoading = false;
        this.updateStoredStatus(request.message, request.payload);
      }
    });
    let lastCategory = localStorage.getItem(this.lastCategoryKey);
    if (lastCategory) {
      this.category = lastCategory;
    }
  },
  methods: {
    updateStoredStatus(message, payload) {
      if (message == "success") {
        this.close();
      } else {
        alert(payload);
      }
    },
    save() {
      if (this.additionalMeaning) this.items.push(this.additionalMeaning);
      if (this.additionalExample) this.items.push(this.additionalExample);
      this.isLoading = true;
      StorageService.store(
        this.localTranslation.word,
        this.items,
        this.category
      );
      this.items = [];
      this.additionalMeaning = "";
      this.additionalExample = "";
      localStorage.setItem(this.lastCategoryKey, this.category);
    },
    close() {
      this.hidden = true;
    },
    isIncluesSeleted(item) {
      return this.items.indexOf(item) !== -1;
    },
    itemClicked(item) {
      if (this.isIncluesSeleted(item)) {
        let itemIndex = this.items.indexOf(item);
        this.items.splice(itemIndex, 1);
      } else this.items.push(item);
    },
  },
};
</script>

<style scoped>
.close-button span {
  margin-top: -2px;
}
.close-button {
  position: absolute;
  left: -30px;
  top: -20px;
  z-index: 20;
  height: 35px;
  width: 35px;
  padding: 1px;
}
.save-button {
  position: absolute;
  left: -77px;
  top: 260px;
  border-radius: 4px 0 0;
}
.hidden {
  visibility: hidden;
  opacity: 0;
}
.translator-wraper [role="tablist"] {
  position: fixed;
  transform: translateY(-40px);
}
.translation-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 4px;
  margin: 0 0 4px 4px;
  cursor: pointer;
}

.main-card {
  overflow-y: scroll;
}
.main-card::-webkit-scrollbar {
  display: none;
}
</style>