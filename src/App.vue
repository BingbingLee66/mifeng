<template>
  <div id="app">
    <keep-alive include="member">
      <router-view />
    </keep-alive>

  </div>
</template>

<script>
  export default {
    name: "App",
  };
</script>
