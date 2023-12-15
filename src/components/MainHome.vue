<template>
<div class="main-container" :class="getTheme('bgc')">
    <div class="main-wrapper">
        <div class="main-header" :class="getTheme('main-side-bgc')">
            <div class="header-buttons">
                <div style="background-color: #ec695d"></div>
                <div style="background-color: #60c453"></div>
                <div style="background-color: #f4be4e"></div>
            </div>
            <div style="font-weight: bold">
                JAVASCRIPT-ARCHIVE
            </div>
            <div style="display: flex; gap: 10px">
                <input type="button" class="btn-theme" @click="changeTheme" />
                <input type="button" class="btn-github" @click="open" />
            </div>
        </div>
        <!-- mobile-list -->
        <div v-if="status.mobile" class="m-list-wrapper slide-in-component" :class="{ 'slide-in': status.openList }">
            <div class="m-list-header" :class="getTheme('main-side-bgc')">
                <div>
                    Total {{ codes.length || 0 }} Codes
                </div>
            </div>
            <div class="m-list-header" :class="getTheme('main-bgc')">
                javascript-archive
            </div>
            <div class="m-list-content">
                <CodeList ref="list" :selected="code" :codes="codes" @display="display" @add="add" />
            </div>
        </div>
        <div class="main-content" :class="getTheme('code-block-bgc')">
            <div v-if="!status.mobile" class="list-container" :class="getTheme('main-side-bgc')">
                <div class="list-header" :class="getTheme('main-side-bgc')">
                    <div>
                        Total {{ codes.length || 0 }} Codes
                    </div>
                </div>
                <div class="list-header" :class="getTheme('main-bgc')">
                    javascript-archive
                </div>
                <div class="list-content">
                    <CodeList ref="list" :selected="code" :codes="codes" @display="display" @add="add" />
                </div>
            </div>
            <div style="flex: 1 auto">
                <div class="code-block-header-wrapper" :class="getTheme('main-side-bgc')">
                    <div v-if="!status.input" class="code-block-header" :class="getTheme('code-block-bgc')">
                        <div>
                            {{ code.title || "" }}
                        </div>
                        <div v-show="!code.sampleStatus">
                            <div class="btn-close" @click="close"></div>
                        </div>
                    </div>
                    <div v-else class="code-block-header" :class="getTheme('code-block-bgc')" style="padding: 5px">
                        <div>
                            <input type="text" ref="inpTitle" v-model="code.title" class="inp-add-title" />
                        </div>
                    </div>
                </div>
                <div class="code-block-content-wrapper">
                    <div v-show="status.input" class="inp-add-content-container">
                        <textarea v-model="code.content" class="inp-add-content" />
                    </div>
                    <div v-show="!status.input">
                        <CodeHighlighter ref="highlighter" />
                    </div>
                </div>
            </div>
        </div>
        <div class="static-btn-container">
            <div v-if="status.mobile" class="static-btn center" :class="getTheme('static-btn')" @click="status.openList = !status.openList">
                <div :class="status.openList ? 'btn-close' : 'btn-list'"></div>
            </div>
            <div class="static-btn center" :class="getTheme('static-btn')" @click="status.input ? save() : add()">
                <div :class="status.input ? code.title ? 'btn-confirm-hover' : 'btn-confirm' : 'btn-add'"></div>
            </div>
            <div v-show="!code.sampleStatus" class="static-btn center" :class="getTheme('static-btn')" @click="copy">
                <div :class="status.copy ? 'btn-confirm-hover' : 'btn-copy'"></div>
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
    
    props: {
        theme: String
    },

    data() {
        return {
            prefix: {
                local: "_local_",
                sample: "_sample_"
            },
            status: {
                input: false,
                mobile: false,
                openList: false,
                copy: false
            },
            codes: [],
            code: {
                origin: "",
                title: "",
                content: "",
                sampleStatus: true
            }
        }
    },

    created() {
        console.log("javascript-archive by @youngdev57");
    },

    mounted() {
        this.checkMobileStatus();
        window.addEventListener('resize', this.checkMobileStatus);

        this.init();
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.checkMobileStatus);
    },

    methods: {
        checkMobileStatus() {
            this.status.mobile = window.innerWidth <= 767;
        },

        applyMobilePrefix(className = "") {
            return this.status.mobile ? `m-${className}` : className;
        },

        init() {
            this.code = {
                origin: "",
                title: "README.md",
                content: "> hello world.",
                sampleStatus: true
            };

            this.codes = [];
            this.status.input = false;
            this.status.openList = false;
            this.$refs.highlighter.init();

            this.checkMobileStatus();
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

        closeList() {
            this.status.openList = false;
        },

        display(code) {
            this.closeList();

            if (this.status.input)
                this.status.input = false;

            this.code = code;
            this.$refs.highlighter.setCode(this.code.content, this.code.sampleStatus);
        },

        async add() {
            this.closeList();
            
            if (this.code)
                this.init();

            this.code.title = "";
            this.code.content = "";
            this.status.input = true;
            
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

            navigator.clipboard.writeText(this.code.content);
            this.status.copy = true;
            setTimeout(() => {
                this.status.copy = false;
            }, 2000);
        },

        open() {
            window.open("https://github.com/youngdev57/javascript-archive", "_blank");
        },

        close() { // FIXME need to change name. (close / closeList)
            this.init();
        },

        changeTheme() {
            this.$emit("change");
            this.$refs.list.changeTheme();
        },

        getTheme(className) {
            console.log(`${className}-${this.theme}`);
            return `${className}-${this.theme}`;
        }
    }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Lilita+One&display=swap");
@import "@/assets/styles/styles.css";

@media screen and (max-width: 767px) {
    .m-list-wrapper {
        position: absolute;
        top: 40px;
        left: 0;
        width: 70%;
        height: calc(100% - 40px);
        /* background-color: #21252b; */
        box-shadow: 0 2px 1px rgba(0,0,0,0.09),
                    0 4px 2px rgba(0,0,0,0.09),
                    0 8px 4px rgba(0,0,0,0.09),
                    0 16px 8px rgba(0,0,0,0.09),
                    0 32px 16px rgba(0,0,0,0.09);
        }
    .m-list-wrapper > .m-list-header {
        width: 100%; 
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
    }
    .m-list-wrapper > .m-list-content {
        width: 100%;
        height: calc(100% - 60px);
    }
}


.bgc-dark {
    color: $code-block-bgc-light;
}
.bgc-light {
    color: $code-block-bgc-dark;
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
    /* color: #999b9e; */
    /* background-color: #21252b; */
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
    /* background-color: #282c33; */
    display: flex;
}
.list-container {
    width: 300px;
    height: 100%;
    /* background-color: #21252b; */
    overflow: auto;
}
.list-container > .list-header {
    width: 100%; 
    height: 30px;
    line-height: 30px;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.list-container > .list-content {
    width: 100%;
    height: calc(100% - 60px);
}
.code-block-header-wrapper {
    width: 100%;
    height: 30px;
    /* background-color: #21252b; */
}
.code-block-header {
    min-width: 200px;
    width: fit-content;
    height: 100%;
    /* background-color: #282c33; */
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
.code-highlighter-content {
    width: 500px;
    height: fit-content;
    max-height: 500px;
    padding: 10px;
    white-space: pre;
    overflow: auto;
}
.code-style {
    /* color: #fdfaf2; */
    letter-spacing: 2px;
    font-size: 14px;
    line-height: 20px;
}
.inp-block-header {
    width: 350px;
    text-align: center;
    border: none;
    /* color: #ff99ad;  */
    background-color: transparent;
}
.inp-add-title {
    width: 200px;
    height: 100%;
    border: 1px solid #36486b;
    background-color: #1b1d24;
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

}

.main-bgc-dark {
    transition: 0.1s;
    background-color: $main-bgc-dark;
}
.main-bgc-light {
    transition: 0.1s;
    background-color: $main-bgc-light;
}
.main-side-bgc-dark {
    transition: 0.1s;
    background-color: $main-side-bgc-dark;
}
.main-side-bgc-light {
    transition: 0.1s;
    background-color: $main-side-bgc-light;
}
.code-block-bgc-dark {
    transition: 0.1s;
    background-color: $code-block-bgc-dark;
}
.code-block-bgc-light {
    transition: 0.1s;
    background-color: $code-block-bgc-light;
}

.static-btn-dark {
    transition: 0.1s;
    background-color: $main-side-bgc-dark;
}
.static-btn-light {
    transition: 0.1s;
    background-color: $main-side-bgc-light;
}
.static-btn-dark:hover {
    transition: 0.1s;
    background-color: $code-block-bgc-dark;
}
.static-btn-light:hover {
    transition: 0.1s;
    background-color: $code-block-bgc-light;
}
</style>