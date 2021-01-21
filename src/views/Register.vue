<template>
  <div>
      Register page
      <div v-if="error">{{error}}</div>
      <form @submit.prevent="signUp">
          <div class="email">
              <label >Email: </label>
              <input v-model="email" type="email" placeholder="input your email">
          </div>
          <div class="password">
              <label>Password: </label>
              <input v-model="password" type="password" placeholder="At least 6 chars including number and letters">
          </div>
          <button type="submit">Register</button>
      </form>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
export default {
    data(){
        return {
            error:"",
            email:"",
            password:""
        }
    },
    methods:{
        signUp(){
            console.log('Sign up ' + this.password)
            firebase.auth().createUserWithEmailAndPassword(this.email,this.password)
                    .then((user)=>{
                        console.log(user)
                        console.log('signed up successfully')
                        this.$router.push('/')
                    })
                    .catch((error)=>{
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(error)
                    })
        }
    }


}
</script>

<style>

</style>