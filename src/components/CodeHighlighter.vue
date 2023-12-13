<template>
    <div>
        <transition name="fade">
            <div v-show="originCode" class="code-highlighter-content code-style">
                <p v-for="(line, idx) in codes" :key="idx" v-html="line"></p>
            </div>
        </transition>
    </div>
</template>
    
<script>
export default {
    name: "CodeHighlighter",

    data() {
        return {
            reserved: ["break","case","catch","class","const","continue","debugger","default","delete","do","else","export","extends","finally","for","function","if","import","instanceof","let","new","return","super","switch","this","throw","try","typeof","var","void","while","with","constructor"],
            originCode: "",
            codes: []
        }
    },

    methods: {
        init() {
            this.codes = [];
            this.originCode = "";
        },

        getOriginCode() {
            return this.originCode;
        },

        setCode(code = "") {
            this.originCode = code;
            this.codes = [];
            const codes = code.split("\n");
            this.setCodeStyle(codes);
        },

        setCodeStyle(codes = []) {
            String.prototype.insert = function(idx, string) {
                if (idx > 0)
                    return `${this.substring(0, idx)}${string}${this.substring(idx, this.length)}`;

                    return string + this;
            };

            codes.forEach((code) => {
                const temp = [];

                this.reserved.forEach((keyword) => {
                    const idx = code.indexOf(keyword);
                    if (idx !== -1) {
                        const openTag = `<span style="color: #ffee6f">`;
                        const closeTag = `</span>`;
                        code = code.insert(idx, openTag);
                        code = code.insert(idx + keyword.length + openTag.length, closeTag);
                    }
                    temp.push(code);
                });
                
                if (temp.length > 0)
                    code = temp[temp.length - 1];

                const openTag = `<span style="color: gray">`;
                const closeTag = `</span>`;

                const idx = code.indexOf("//");

                if (idx !== -1) {
                    code = code.insert(idx, openTag);
                    code = code.insert(code.length, closeTag);
                }
                this.codes.push(code);
            });
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic+Coding&display=swap');

::selection {
    background-color: rgb(255, 187, 198) !important;
    color: black !important;
}
.code-highlighter-content {
    width: 500px;
    height: fit-content;
    max-height: 500px;
    background-color: #333;
    padding: 10px;
    white-space: pre;
    overflow: auto;
    font-family: 'Nanum Gothic Coding', monospace;
}
.code-style {
    color: #fdfaf2;
    letter-spacing: 2px;
    font-size: 14px;
    line-height: 20px;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>