<template>
    <div>
        <div v-for="(code, idx) in codes"
            :key="`${code.origin}-${idx}`"
            class="code-title"
            :style="`background-color: ${selected && selected.title === code.title ? '#2b313b' : ''}`"
            @click="emitDisplay(code)">
            {{ code.title }}
        </div>
    </div>
</template>
  
<script>
export default {
    name: "CodeList",
    props: {
        codes: Array,
        selected: {
            type: Object,
            default: () => {}
        }
    },

    methods: {
        emitDisplay(code) {
            this.$emit("display", code);
        },
        emitAdd() {
            this.$emit("add");
        }
    }
}
</script>

<style scoped>
.code-title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    color: #fff;
    padding: 0 40px;
    box-sizing: border-box;
    cursor: pointer;
}
.code-title:hover {
    cursor: pointer;
    background-color: #262a31;
    transition: all 0.2s;
}
</style>