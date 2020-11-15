<template>
<div id="auth">
 <router-view></router-view>
</div>
   
</template>



<script>
export default {
    name: 'Auth'
}
</script>
<style >
    body{
    overflow-x: hidden !important;
 
}
#auth{
    height: 100%;
}
</style>