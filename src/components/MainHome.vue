<template>
<div class="container">
    <div class="wrapper">
        <div class="title">
            <p>ARCHIVE OF</p>
            <p>JAVASCRIPT</p>
            <p>BY YOUNGDEV57</p>
            <input type="button" class="btn-github" @click="open" />
        </div>
        <div v-show="codeTitles.length > 0" class="list">
            <CodeList ref="list"
                    :codes="codeTitles"
                    @display="display" />
        </div>
        <div class="code-highlighter-container">
            <div class="code-highlighter-wrapper">
                <div class="code-highlighter-header">
                    <div class="header-buttons" @click="hide">
                        <div style="background-color: #ec695d"></div>
                        <div style="background-color: #60c453"></div>
                        <div style="background-color: #f4be4e"></div>
                    </div>
                    <div>{{ welcomeMessage || "hello world (｡˃ ᵕ ˂ )b" }}</div>
                    <div class="btn-copy" @click="copy"></div>
                </div>
                <code-highlighter ref="highlighter"></code-highlighter>
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
            welcomeMessage: "",
            codeTitles: []
        }
    },

    mounted() {
        console.log("javascript-archive by @youngdev57");
        this.getCodeTitles();
    },

    methods: {
        getCodeTitles() {
            this.codeTitles = [];

            const requireComponent = require.context(
                '@/../public/files/',
                false,
                /\.(txt|js|html|css)$/
            );

            for (const property in requireComponent.keys()) {
                const splited = requireComponent.keys()[property].split("/");
                if (splited.length > 0)
                    this.codeTitles.push(splited[1]);
            }
        },

        display(name) {
            this.welcomeMessage = name;
            this.getCodeContent(name);
        },

        getCodeContent(name) {
            this.code = "";

            fetch(`${process.env.BASE_URL}files/${name}`)
                .then(response => {
                    if (!response.ok)
                        throw new Error('cannot load file');
                    
                    return response.text();
                })
                .then(data => {
                    this.code = data;
                    this.$refs.highlighter.setCode(this.code);
                })
                .catch(error => {
                    console.error(error);
                });
        },

        hide() {
            this.$refs.highlighter.init();
            this.code = "";
            this.welcomeMessage = "";
        },

        copy() {
            if (!this.code)
                return;

            const origin = this.welcomeMessage;
            navigator.clipboard.writeText(this.code);
            this.welcomeMessage = "copied!";
            setTimeout(() => {
                this.welcomeMessage = origin;
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
.list {
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: fit-content;
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
.btn-copy {
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
</style>