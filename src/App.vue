<template>
<div id="app">
    <MainHome />
</div>
</template>

<script>
import MainHome from "./components/MainHome.vue"

export default {
    name: "App",
    components: {
        MainHome
    }
}
</script>

<style scoped>
@import url("@/assets/styles/reset.css");
@import url("https://fonts.googleapis.com/css?family=Roboto+Condensed");

#app {
	height: 100vh;
    background-color: #333841;
    font-size: 0.8em;
}
</style>