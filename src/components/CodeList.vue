<template>
    <div class="code-container">
        <div v-for="title in codes" :key="title" @click="emitDisplay(title)">
            {{ title }}
        </div>
    </div>
</template>
  
<script>
export default {
    name: "CodeList",
    props: {
        codes: Array
    },
    methods: {
        emitDisplay(title) {
            this.$emit("display", title);
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
.code-container > div {
    width: fit-content;
    height: 20px;
    line-height: 20px;
    color: #ff99ad;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 5px;
    background-color: #333;
}
.code-container > div:hover {
    cursor: pointer;
    background-color: #ff99ad;
    color: #333;
    transition: all 0.3s;
}
</style>