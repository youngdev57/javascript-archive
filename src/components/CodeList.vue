<template>
    <div class="code-container">
        <div class="code-header">
            <div class="code-title" style="flex: 1 0 auto">총 {{codes.length || 0}} 개의 저장된 코드</div>
            <div class="code-title" @click="emitAdd">+</div>
        </div>
        <div v-for="(code, idx) in codes" :key="`${code.origin}-${idx}`" class="code-title" @click="emitDisplay(code)">
            {{ code.title }}
        </div>
    </div>
</template>
  
<script>
export default {
    name: "CodeList",
    props: {
        codes: {
            type: Array,
            default: () => []
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
.code-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}
.code-header {
    width: 100%;
    display: flex;
    gap: 5px;
}
.code-header > .code-title {
    background-color: #ff99ad;
    border: 1px solid #ff99ad;
    color: #333;
}
.code-header > .code-title:hover {
    background-color: transparent;
    border: 1px solid #ff99ad;
    color: #ff99ad;
}
.code-title {
    width: fit-content;
    height: 20px;
    line-height: 20px;
    color: #ff99ad;
    padding: 5px 10px;
    border-radius: 5px;
    background-color: #333;
}
.code-title:hover {
    cursor: pointer;
    background-color: #ff99ad;
    color: #333;
    transition: all 0.3s;
}
</style>