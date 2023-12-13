<template>
<div class="container">
    <div class="wrapper">
        <div class="title">
            <p>ARCHIVE OF</p>
            <p>JAVASCRIPT</p>
            <p>BY YOUNGDEV57</p>
            <input type="button" class="btn-github" @click="open" />
        </div>
        <div class="list-container">
            <div v-show="codes.length > 0">
                <CodeList ref="list" :codes="codes" @display="display" @add="add" />
            </div>
        </div>
        <div class="code-highlighter-container">
            <div class="code-highlighter-wrapper">
                <div class="code-highlighter-header">
                    <div class="header-buttons" @click="hide">
                        <div style="background-color: #ec695d"></div>
                        <div style="background-color: #60c453"></div>
                        <div style="background-color: #f4be4e"></div>
                    </div>
                    <div style="width: fit-content;">
                        <div v-if="inputStatus">
                            <input type="text" v-model="codeTitle" placeholder="추가할 코드를 복사한 상태에서 제목을 입력하고 저장해주세요." class="inp-block-header" />
                        </div>
                        <div v-else style="font-size: 0.9em">{{ blockHeaderText || "@youngdev57" }}</div>
                    </div>
                    <div>
                        <div v-if="inputStatus && codeTitle" class="btn-save" @click="save"></div>
                        <div v-else-if="!inputStatus" class="btn-copy" @click="copy"></div>
                    </div>
                </div>
                <CodeHighlighter ref="highlighter" />
            </div>
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
            this.blockHeaderText = "";
            this.codes = [];
            this.codeTitle = "";
            this.inputStatus = false;
            this.loadCodes();
        },

        loadCodes() {
            this.loadSampleCodes();

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
.container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
}
.wrapper {
    width: 100%;
    max-width: 1000px;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
}
.wrapper > .title {
    font-size: 7em;
    color: #ff99ad;
    font-weight: 900;
    font-family: "Lilita One", sans-serif;
    white-space: nowrap;
}
.list-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 400px;
    height: fit-content;
}
.list-container > div {
    border: 1px solid #ff99ad;
    background-color: rgba(255, 255, 255, 0.7);
    margin: 20px;
    padding: 20px;
    box-sizing: border-box;
    overflow: auto;
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
.btn-copy:hover {
    background-image: url('@/assets/resources/copy-hover.svg');
    background-size: 100% 100%;
}
.btn-github {
    cursor: pointer;
    background: none;
    border: none;
    width: 90px;
    height: 90px;
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
</style>