<template>
    <div>
        <div v-for="(code, idx) in codes"
            :key="`${code.origin}-${idx}`"
            class="code-title"
            :class="theme"
            :style="`background-color: ${selected && selected.title === code.title ? theme === 'dark' ? '#2b313b' : '#dbdbdc' : ''}`"
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

    data() {
        return {
            theme: window.localStorage.getItem("theme")
        }
    },

    methods: {
        emitDisplay(code) {
            this.$emit("display", code);
        },
        emitAdd() {
            this.$emit("add");
        },
        getTheme() {
            if (!this.theme)
                window.localStorage.setItem("theme", "dark");
        },
        changeTheme() {
            window.localStorage.setItem("theme", this.theme === "dark" ? "light" : "dark");
            this.theme = window.localStorage.getItem("theme");
            console.log("theme: ", this.theme);
        }
    }
}
</script>

<style lang="scss">
.code-title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding: 0 40px;
    box-sizing: border-box;
    cursor: pointer;
}
.code-title:hover {
    cursor: pointer;
    /* background-color: #262a31; */
    transition: all 0.2s;
}
.dark:hover {
    background-color: $main-side-item-hover-dark;
}
.light:hover {
    background-color: $main-side-item-hover-light;
}
</style>