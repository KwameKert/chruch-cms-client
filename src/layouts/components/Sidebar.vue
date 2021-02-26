<template>
<div>
 
<div class="bg-light border-right " id="sidebar-wrapper">
     <h4 class="text-center py-3">The Ambassador</h4>

      <div class="row " >
        <div class="col-md-6 "  style="margin-left: 70px">
            <img src="@/assets/img/blue.jpg" alt="plant admin" class="rounded-circle" width="100px" height="100px" >
            <b class="text-bold ml-1">Administrator</b>
        </div>
        
    </div>
    
      <div class="list-group list-group-flush mt-4">
        <router-link  class="list-group-item list-group-item-action bg-light" to="/dashboard">
        <i class="mdi mdi-home"></i>
         Dashboard
        </router-link>

        <router-link  class="list-group-item list-group-item-action bg-light" to="/event">
          <i class="mdi mdi-calendar"></i>  Events
        </router-link>

         <router-link  class="list-group-item list-group-item-action bg-light" to="/verse">
          <i class="fas fa-bible"></i>  Verses
        </router-link>
         <router-link  class="list-group-item list-group-item-action bg-light" to="/sermon">
          <b-icon icon="collection-play-fill"></b-icon>
  Sermons
  
        </router-link>

        <!-- <router-link  class="list-group-item list-group-item-action bg-light" to="/department">
          <i class="mdi mdi-office-building"></i>  Departments
        </router-link>

        <router-link  class="list-group-item list-group-item-action bg-light" to="/event">
          <i class="mdi mdi-contacts"></i>  Leaders
        </router-link> -->
       

      </div>
    </div>  
</div>

  
</template>

<script>
export default {
    name: 'Sidebar'

}
</script>

<style>

.sticky{
  position: fixed !important;
  background-color:red !important;
}

</style>