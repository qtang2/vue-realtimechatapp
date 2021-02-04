<template>
    <div class="outter_container">
        <div>
            <h1>Welcome to Qian's Chatting Web :)</h1>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-md-4 col-md-offset-4">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title">Register </h3>
                        </div>
                        <div class="panel-body">
                            <form accept-charset="UTF-8" role="form" @submit.prevent="signUp">
                            <fieldset>
                                <div class="form-group">
                                    <input v-model="email" class="form-control" placeholder="yourmail@example.com" name="email" type="text" required>
                                    
                                </div>
                                <div class="form-group">
                                    <input v-model="username" class="form-control" placeholder="username" name="username" type="text" required>
                                    
                                </div>
                                <div class="form-group">
                                    <input v-model="password" class="form-control" placeholder="Password" name="password" type="password" value="" required>
                                </div>
                                
                                <input class="btn btn-lg btn-success btn-block" type="submit" value="Sign Up">
                            </fieldset>
                            </form>

                            <span>Have an account, click here to <router-link to="/login">login</router-link> </span>
                            <div class="error" v-if="error">{{error}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <page-footer />
    </div>
  
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import Footer from '../components/Footer'
export default {
    components:{
        'page-footer':Footer
    },
    data(){
        return {
            error:"",
            email:"",
            username:"",
            password:""
        }
    },
    methods:{
        signUp(){    
            //Check unique username first, then start register process        
            this.$store.state.db.collection('users').get()
                .then(users =>{
                    let existedUsernames = []
                    users.forEach(user =>{
                        existedUsernames.push(user.data().displayName)
                    })
                    console.log("existed unmes ", existedUsernames,"  ",existedUsernames.includes(this.username))
                    //Check if username is unique
                    if(!existedUsernames.includes(this.username)){
                        firebase.auth().createUserWithEmailAndPassword(this.email,this.password)
                                .then((userCredential)=>{
                                    var user = userCredential.user
                                    user.updateProfile({
                                        displayName: this.username,
                                        photoURL: "https://www.prosoftx.com/files/2019/02/blank-user.png"
                                    }).then(() =>{
                                
                                    //add a user to users collection
                                    this.$store.state.db.collection('users').doc(user.uid).set({
                                        displayName: user.displayName,
                                        email: user.email,
                                        photoURL: user.photoURL
                                    })
                                    let authUser = {
                                        uid: user.uid,
                                        displayName: user.displayName,
                                        email: user.email,
                                        photoURL: user.photoURL
                                    }
                                    console.log('user added to the user collection')
                                    this.$store.dispatch('setAuthUser',authUser)
                                    this.$router.replace('/')
                                    }, function(error) {
                                        // An error happened.
                                        console.log(error)
                                    })                        
                                })
                                .catch((error)=>{
                                    var errorCode = error.code;
                                    var errorMessage = error.message;
                                    console.log(error)
                                })
                    }
                    else{
                        console.log('Username exist, try another one :)')
                        this.error = "Username exist, try another one :)"
                    } 
                })
                .catch((error)=>{
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    this.error = errorMessage
                    console.log(error)
                })
            
        }
    }
}
</script>

<style scoped>
.container{
    margin-left: 35%;
    padding: 4px;
}
.white{
    color:#000;
    background-color:#fff;
}
</style>