<template>
<div class="main-container">
    <div class="main-wrapper">
        <div class="main-header">
            <div class="header-buttons">
                <div style="background-color: #ec695d"></div>
                <div style="background-color: #60c453"></div>
                <div style="background-color: #f4be4e"></div>
            </div>
            <div style="font-weight: bold">
                JAVASCRIPT-ARCHIVE
            </div>
            <div>
                <input type="button" class="btn-github" @click="open" />
            </div>
        </div>
        <div class="main-content">
            <div class="list-container">
                <div class="list-header" style="background-color: #21252b">
                    <div>
                        Total {{ codes.length || 0 }} Codes
                    </div>
                </div>
                <div class="list-header" style="background-color: #333841">
                    javascript-archive
                </div>
                <div class="list-content">
                    <CodeList ref="list" :selected="code" :codes="codes" @display="display" @add="add" />
                </div>
            </div>
            <div style="flex: 1 auto">
                <div class="code-block-header-wrapper">
                    <div v-if="!inputStatus" class="code-block-header">
                        <div>
                            {{ code.title || "" }}
                        </div>
                        <div v-show="!code.sampleStatus">
                            <div class="btn-close" @click="close"></div>
                        </div>
                    </div>
                    <div v-else class="code-block-header" style="padding: 5px">
                        <div>
                            <input type="text" ref="inpTitle" v-model="code.title" class="inp-add-title" />
                        </div>
                        <div>
                            <div class="btn-confirm" @click="save"></div>
                        </div>
                    </div>
                </div>
                <div class="code-block-content-wrapper">
                    <div v-show="inputStatus" class="inp-add-content-container">
                        <textarea v-model="code.content" class="inp-add-content" />
                    </div>
                    <div v-show="!inputStatus">
                        <CodeHighlighter ref="highlighter" />
                    </div>
                </div>
            </div>
        </div>
        <div class="static-btn-container" @click="inputStatus ? save() : add()" style="bottom: 20px; right: 20px">
            {{ inputStatus ? "Save" : "Add" }}
        </div>
        <div v-show="!code.sampleStatus" class="static-btn-container" @click="copy" style="bottom: 60px; right: 20px">
            <p>{{ copyText || "" }}</p>
        </div>
    </div>
</div>
</template>

<script>
import CodeList from './CodeList.vue'
import CodeHighlighter from './CodeHighlighter.vue'

export default {
    name: "MainHome",
    components: {
        CodeList,
        CodeHighlighter
    },

    data() {
        return {
            prefix: {
                local: "_local_",
                sample: "_sample_"
            },
            codes: [],
            inputStatus: false,
            code: {
                origin: "",
                title: "",
                content: "",
                sampleStatus: true
            },
            copyText: "Copy"
        }
    },

    created() {
        console.log("javascript-archive by @youngdev57");
    },

    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.code = {
                origin: "",
                title: "README.md",
                content: `github: https://github.com/youngdev57/javascript-archive`,
                sampleStatus: true
            };

            this.codes = [];
            this.inputStatus = false;
            this.$refs.highlighter.init();

            this.loadCodes();
            this.display(this.code);
        },

        loadCodes() {
            for (const key in window.localStorage) {
                if (key.includes(this.prefix.local)) {
                    this.codes.push({
                        origin: key,
                        title: this.extractTitle(key),
                        content: window.localStorage.getItem(key),
                        sampleStatus: false
                    });
                }
            }
        },

        extractTitle(title) {
            return title.replace(this.prefix.local, "")
                        .replace(".txt", "");
        },

        display(code) {
            if (this.inputStatus)
                this.inputStatus = false;

            this.code = code;
            this.$refs.highlighter.setCode(this.code.content, this.code.sampleStatus);
        },

        async add() {
            if (this.code)
                this.init();

            this.code.title = "";
            this.code.content = "";
            this.inputStatus = true;
            
            await this.$nextTick();
            this.$refs.inpTitle.focus();
        },

        save() {
            if (!this.code.title)
                return;

            const key = `${this.prefix.local}${this.code.title}`;
            window.localStorage.setItem(key, this.code.content);

            this.init();
        },

        copy() {
            if (!this.code.content || this.code.sampleStatus)
                return;

            const origin = this.copyText;
            navigator.clipboard.writeText(this.code.content);
            this.copyText = "Copied!";
            setTimeout(() => {
                this.copyText = origin;
            }, 2000);
        },

        open() {
            window.open("https://github.com/youngdev57/javascript-archive", "_blank");
        },

        close() {
            this.init();
        }
    }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Lilita+One&display=swap");
@import "@/assets/styles/common.css";

::selection {
    background-color: rgba(0, 0, 0, 0.7);
}
::placeholder {
    color: #5e5e5e;
}
.main-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
}
.main-wrapper {
    width: 100%;
    max-width: 1024px;
    height: 100%;
}
.main-wrapper > .main-header {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
    color: #999b9e;
    background-color: #21252b;
}
.header-buttons {
    display: flex;
    align-items: center;
    gap: 5px;
}
.header-buttons > div {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}
.main-content {
    width: 100%;
    height: calc(100% - 40px);
    background-color: #282c33;
    display: flex;
}
.main-content > .list-container {
    width: 300px;
    height: 100%;
    background-color: #21252b;
    overflow: auto;
}
.main-content > .list-container > .list-header {
    width: 100%; 
    height: 30px;
    color: #fff;
    line-height: 30px;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.main-content > .list-container > .list-content {
    width: 100%;
    height: calc(100% - 60px);
}
.code-block-header-wrapper {
    width: 100%;
    height: 30px;
    background-color: #21252b;
}
.code-block-header {
    min-width: 200px;
    width: fit-content;
    height: 100%;
    background-color: #282c33;
    color: #fff;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}
.code-block-content-wrapper {
    width: 100%;
    height: calc(100% - 30px);
    overflow-y: auto;
}
.code-highlighter-container {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: fit-content;
    justify-content: center;
    margin-bottom: 40px;
}
.code-highlighter-header {
    width: 500px;
    height: fit-content;
    display: flex;
    justify-content: space-between;
    background-color: #333;
    padding: 10px;
    color: #ff99ad;
}
.code-highlighter-content {
    width: 500px;
    height: fit-content;
    max-height: 500px;
    background-color: #333;
    padding: 10px;
    white-space: pre;
    overflow: auto;
}
.code-style {
    color: #fdfaf2;
    letter-spacing: 2px;
    font-size: 14px;
    line-height: 20px;
}
.inp-block-header {
    width: 350px;
    text-align: center;
    border: none;
    color: #ff99ad; 
    background-color: transparent;
}
.inp-add-title {
    width: 200px;
    height: 100%;
    border: 1px solid #36486b;
    background-color: #1b1d24;
    color: #fff;
    outline: none;
}
.inp-add-content-container {
    width: 100%;
    height: 100%;
    padding: 10px;
}
.inp-add-content {
    width: 100%;
    height: 80%;
    background-color: transparent;
    border: none;
    outline: none;
    color: #fff;
}
</style>