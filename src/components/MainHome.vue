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
                        총 {{ codes.length || 0 }} 개의 저장된 코드
                    </div>
                </div>
                <div class="list-header" style="background-color: #333841">
                    javascript-archive
                </div>
                <div class="list-content">
                    <CodeList ref="list" :codes="codes" @display="display" @add="add" />
                </div>
            </div>
            <div style="flex: 1 auto">
                <div class="code-block-header-wrapper">
                    <div v-show="code" class="code-block-header">
                        <div>
                            {{ blockHeaderText || "" }}
                        </div>
                        <div v-show="code">
                            <div class="btn-close" @click="close"></div>
                        </div>
                    </div>
                </div>
                <div class="code-block-content-wrapper">
                    <CodeHighlighter ref="highlighter" />
                </div>
            </div>
        </div>
        <div class="static-btn-container" @copy="copy" style="bottom: 20px; right: 20px">
            <p>Add</p>
            <div>+</div>
        </div>
        <div v-show="code" class="static-btn-container" @copy="copy" style="bottom: 60px; right: 20px">
            <p>Copy</p>
            <div class="btn-copy"></div>
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
            blockHeaderText: "",
            prefix: {
                local: "_local_",
                sample: "_sample_"
            },
            code: "",
            codes: [],
            inputStatus: false,
            codeTitle: ""
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
            this.hide();
            this.blockHeaderText = "";
            this.codes = [];
            this.codeTitle = "";
            this.inputStatus = false;

            this.loadCodes();
        },

        loadCodes() {
            // this.loadSampleCodes();

            for (const key in window.localStorage) {
                if (key.includes(this.prefix.local)) {
                    this.codes.push({
                        origin: key,
                        title: this.extractTitle(key),
                        content: window.localStorage.getItem(key)
                    });
                }
            }
        },

        loadSampleCodes() {
            const requireComponent = require.context(
                '@/../public/files/',
                false,
                /\.(txt|js|html|css)$/
            );

            for (const property in requireComponent.keys()) {
                const splited = requireComponent.keys()[property].split("/");
                if (splited.length > 0) {
                    fetch(`${process.env.BASE_URL}files/${splited[1]}`)
                        .then(response => {
                            if (!response.ok)
                                throw new Error('Failed to load sample files.');
                            
                            return response.text();
                        })
                        .then(data => {
                            this.codes.push({
                                origin: splited[1],
                                title: this.extractTitle(splited[1]),
                                content: data
                            });
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            }
        },

        extractTitle(title) {
            return title.replace(this.prefix.sample, "")
                        .replace(this.prefix.local, "")
                        .replace(".txt", "");
        },

        display(code) {
            if (this.inputStatus)
                this.inputStatus = false;

            this.blockHeaderText = code.title;
            this.code = code.content;
            this.$refs.highlighter.setCode(this.code);
        },

        add() {
            if (this.code)
                this.hide();

            this.inputStatus = true;
        },

        save() {
            function getClipboardTextModern() {
                return navigator.clipboard.readText();
            }

            getClipboardTextModern().then((clipboardContent) => {
                if (clipboardContent) {
                    window.localStorage.setItem(`${this.prefix.local}${this.codeTitle}`, clipboardContent);
                    this.init();
                }
            }).catch(function (err) {
                console.error("Failed to read clipboard content:", err);
            });
        },

        hide() {
            this.$refs.highlighter.init();
            this.code = "";
            this.blockHeaderText = "";
        },

        copy() {
            if (!this.code)
                return;

            const origin = this.blockHeaderText;
            navigator.clipboard.writeText(this.code);
            this.blockHeaderText = "copied!";
            setTimeout(() => {
                this.blockHeaderText = origin;
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

::selection {
    background-color: rgba(0, 0, 0, 0.7);
}
::placeholder {
    color: #ff99ad;
}
input {
    outline: #ff99ad;
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
.btn-save {
    cursor: pointer;
    width: 16px;
    height: 16px;
    background-image: url('@/assets/resources/save.svg');
    background-size: 100% 100%;
}
.btn-save:hover {
    background-image: url('@/assets/resources/save-hover.svg');
    background-size: 100% 100%;
}
.btn-copy {
    cursor: pointer;
    width: 16px;
    height: 16px;
    background-image: url('@/assets/resources/copy.svg');
    background-size: 100% 100%;
}
.btn-github {
    cursor: pointer;
    background: none;
    border: none;
    width: 20px;
    height: 20px;
    background-image: url('@/assets/resources/github.svg');
    background-size: 100% 100%;
}
.btn-github:hover {
    transition: 0.3s;
    background-image: url('@/assets/resources/github-hover.svg');
    background-size: 100% 100%;
}
.inp-block-header {
    width: 350px;
    text-align: center;
    border: none;
    color: #ff99ad; 
    background-color: transparent;
}
.static-btn-container {
    position: absolute;
    width: fit-content;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background-color: #21252b;
    padding: 0 20px;
    border-radius: 100px;
    box-shadow: 0 2px 1px rgba(0,0,0,0.09), 0 4px 2px rgba(0,0,0,0.09), 0 8px 4px rgba(0,0,0,0.09), 0 16px 8px rgba(0,0,0,0.09), 0 32px 16px rgba(0,0,0,0.09);
    transition: 0.3s;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
}
.static-btn-container:hover {
    transition: 0.3s;
    background-color: #282d36;
}
.btn-close {
    transition: 0.2s;
    cursor: pointer;
    width: 16px;
    height: 16px;
    background-image: url('@/assets/resources/close.svg');
    background-size: 100% 100%;
    border-radius: 5px;
}
.btn-close:hover {
    transition: 0.2s;
    background-color: #5b606a;
}
</style>