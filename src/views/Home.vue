<template>
<main>
  <!-- Introduction -->
  <section class=" py-20 text-white text-center relative">
    <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to Great Boadcasts!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Phasellus et dolor mollis, congue augue non, venenatis elit.
          Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
          sapien. Duis sed magna pulvinar, fringilla lorem eget,
          ullamcorper urna.
        </p>
      </div>
    </div>

    <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="assets/img/introduction-music.png" />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Songs</span>
        <!-- Icon -->
        <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">

        <AudioItem 
        v-for="audio in audios" :key="audio.docID"
        :audio="audio"
        />
        
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section> 
  </main>
</template>

<script>
import AudioItem from '@/components/AudioItem.vue';

import {
   audiosCollection,
    // storage, storageGroup, auth,
    // database,
     db
   } from '@/includes/firebase';

export default {
  name: 'Home',
  components: {
    AudioItem,
  },
  data() {
    return {
      audios: [],
      maxPerPage: 2,
      pendingRequest: false,
    };
  },
  async created() {
    this.getAudios();

    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async getAudios() {
    if (this.pendingRequest) {
      return;
      }
    this.pendingRequest = true;

    let querySnapshot;
    if (this.audios.length) {
    const lastDoc = await db.getDoc(db.doc(audiosCollection,
     this.audios[this.audios.length - 1].docID));
     console.log('lastdoc');
     console.log(lastDoc);
    const q = db.query(audiosCollection,
    db.limit(this.maxPerPage),
     db.orderBy('modified_name'),
     db.startAfter(lastDoc));
    querySnapshot = await db.getDocs(q);
    } else {
      // on first load
    const q = db.query(audiosCollection,
     db.limit(this.maxPerPage),
     db.orderBy('modified_name'));
    querySnapshot = await db.getDocs(q);
    }
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        this.audios.push({
          docID: doc.id,
          ...doc.data(),
        });
      });

    this.pendingRequest = false;
    },
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;
      if (bottomOfWindow) {
        this.getAudios();
        console.log('Bottom of window');
      }
    },
  },
};
</script>

<style>

</style>
