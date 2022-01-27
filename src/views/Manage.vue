<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload"
        :addAudio="addAudio"></app-upload>
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Uploads</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <Composition-item
             v-for="(audio, i) in audios"
             :key="audio.docID" 
             :audio='audio'
             :updateAudio='updateAudio'
             :index='i'
             :removeAudio='removeAudio'
             :updateUnsavedFlag="updateUnsavedFlag"/>
            
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import store from '@/store';
import AppUpload from '@/components/Upload.vue';
import CompositionItem from '@/components/CompositionItem.vue';
import { 
  auth, db, audiosCollection
  } from '@/includes/firebase';

export default {
name: 'manage',
components: {
  AppUpload,
  CompositionItem,
},
data() {
  return {
    audios: [],
    unsavedFlag: false,
  };
},
methods: {
 updateAudio(i, values) {
   this.audios[i].modified_name = values.modified_name;
   this.audios[i].genre = values.genre;
 },
  removeAudio(i) {
   this.audios.splice(i, 1);
 },
 addAudio(audioFile) {
   this.audios.push(audioFile);
 },
 updateUnsavedFlag(value) {
   this.unsavedFlag = value;
 },
},
async created() {
  const q = db.query(audiosCollection,
   db.where("uid", "==", auth.getAuth().currentUser.uid));
   const querySnapshot = await db.getDocs(q);
   querySnapshot.forEach((doc) => {
     const song = {
      ...doc.data(),
      docID: doc.id,
     };
     this.audios.push(song);
   });
   console.log(this.audios);
},
beforeRouteLeave(to, from, next) {
  if (!this.unsavedFlag) {
    next();
  } else {
    // eslint-disable-next-line no-alert, no-restricted-globals
    const leave = confirm("You have unsaved changes. Are you sure you want to leave?");
    next(leave);
  }
},
// beforeRouteLeave(to, from, next) {
//   this.$refs.upload.cancelUploads();
//   next();
// },
// beforeRouteEnter(to, from, next) {
//       if (store.state.userLoggedIn) {
//         next();
//       } else {
//         next({ name: 'home' });
//       }
//   },
};
</script>

<style>

</style>
