<template>

 <transition name="fade" appear>
        <div>
        <p>Delete ' {{toDeleteContact.displayName}} ' ? </p>
        <button class="btn btn-danger btn-sm" type="button" @click="deleteContact">Delete</button>
        <button class="btn btn-default btn-sm" type="button" v-on:click="closeDeleteModal">Cancel</button>
        </div>
    </transition>

   
</template>

<script>
export default {
    
    computed:{
        toDeleteContact(){return this.$store.state.toDeleteContact}
    },
    methods:{
        closeDeleteModal(){
            console.log("close moooooo")
            this.$emit('closeDeleteModal')
        },
        deleteContact(){
            console.log("delecoonnn")
            this.$store.dispatch('deleteContact',this.toDeleteContact)
            this.closeDeleteModal()
            
        }
    }

}
</script>

<style>
button{
    margin-right: 10px;
}

</style>