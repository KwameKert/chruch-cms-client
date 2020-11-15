<template >
  <div id="loginPage">
    <div class="container">
 
      <div class="row justify-content-center">
        <div class="col-md8 col-lg-6 col-xl-5 mt-4">
          <div class="card">
            <div class="card-body">
 <form @submit.prevent="submitForm(form)">
          <h4
            class="text-center mb-5"
            style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          >
            The Ambassador
          </h4>
          <div class="form-group">
            <div class="form-label">Username</div>
            <input
              type="text"
              class="form-control"
              placeholder="Enter username"
              v-model="form.username"
            />
          </div>

          <div class="form-group">
            <div class="form-label">Password</div>
            <input
              type="password"
              class="form-control"
              placeholder="Enter password"
              v-model="form.password"
            />
          </div>
          <div class="text-center">
            <button class="btn btn-primary btn-block" type="submit" :disabled="formIsValid()" >
              <span class="px-3">Login</span>
            </button>
          </div>
        </form>
            </div>
          </div>
        </div>
       
      </div>
   
    </div>
    <!-- <div class="col-md-9">
      <img src="@/assets/img/churchbg.jpg" alt="" class="w-100 h-100" />
    </div> -->
   
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  data() {
    console.log("im here");
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
     formIsValid(){
         return this.form.username.length == 0 && this.form.password.length == 0;
     },
    submitForm: function (form) {
      let loginForm = JSON.parse(JSON.stringify(form));
        axios.post("http://localhost:3000/api/auth/login", loginForm).then(
        (response) => {
          if(response.status == 200){
            let token = response.data.data.token;
            let user = response.data.data.user;
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user));
            this.$router.push({ path: "/dashboard" });
        
          }
          
        },
        (error) => {
          console.error(error);
        }
      );
      // if (loginForm.username === "admin" && loginForm.password === "password") {
      //   this.$router.push({ path: "/dashboard" });
      // }
    },
  },
};
</script>

<style >
#loginPage{
    background-image: url('../assets/img/bg-4.jpg');
     background-color: #3283f6;
    background-size: cover;
    
}
</style>