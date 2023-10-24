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
    background-color: #fdfaf2;
}
* {
    cursor: url(https://cur.cursors-4u.net/nature/nat-3/nat260.cur), auto !important;
}
</style>