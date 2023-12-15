<template>
<div id="app" :class="theme">
    <MainHome :theme="theme" @change="changeTheme" />
</div>
</template>

<script>
import MainHome from "./components/MainHome.vue"

export default {
    name: "App",
    components: {
        MainHome
    },

    data() {
        return {
            theme: window.localStorage.getItem("theme")
        }
    },

    mounted() {
        this.getTheme();
    },

    methods: {
        getTheme() {
            if (!this.theme)
                window.localStorage.setItem("theme", "dark");
        },
        changeTheme() {
            window.localStorage.setItem("theme", this.theme === "dark" ? "light" : "dark");
            this.theme = window.localStorage.getItem("theme");
        }
    }
}
</script>

<style lang="scss">
@import url("@/assets/styles/reset.css");

#app {
	height: 100vh;
    font-size: 0.8em;
}

.bgc-dark {
    background-color: $main-bgc-dark;
}
.bgc-light {
    background-color: $main-bgc-light;
}
</style>