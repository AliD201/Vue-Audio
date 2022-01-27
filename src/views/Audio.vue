!<template>
<main> 
   <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)">
    </div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none"
        @click.prevent="currentAudio === audio ? toggleAudio() : newAudio(audio)"
        >
        <i class="fa"
        :class="{'fa-play': !playing, 'fa-pause':playing}"
        ></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ audio.modified_name }}</div>
        <div>{{  audio.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6" >
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{ audio.comment_count}})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
          <div class="text-white text-center font-bold p-4 mb-4"
          v-if="comment_show_alert"
          :class="comment_alert_variant"
          >
          {{ comment_alert_message }}
          </div>
        <vee-form :validation-schema="schema" v-if="userLoggedIn"
        @submit="addComment">
          <vee-field as="textarea" name="comment"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here...">
            </vee-field>
            <ErrorMessage class="text-red-600" name='comment'/>
          <button 
          type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block"
          :disabled="comment_in_submission"
          >
            Submit
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select
        v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded">
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto" id="#comments">
    <li 
    v-for="comment in sortedComments" :key="comment.comID"
    class="p-6 bg-gray-50 border border-gray-200"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}</div>
        <time>{{ comment.datePosted }}</time>
      </div>

      <p>
        {{ comment.content }}
      </p>
    </li>
  </ul>
</main>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import {
//    storageRef, storage, storageGroup,
 auth,
    database,
    commentsCollection,
// audiosCollection,
     db
   } from '@/includes/firebase';

export default {
    name: 'Audio',
    data() {
        return {
            audio: {},
            schema: {
                comment: 'required|min:3',
            },
            comment_in_submission: false,
            comment_show_alert: false,
            comment_alert_variant: 'bg-blue-500',
            comment_alert_message: 'Please wait! your comment is being submitted. ',
            comments: [],
            sort: '1',
        };
    },
    computed: {
        ...mapState(['userLoggedIn', 'currentAudio']),
        ...mapGetters(['playing']),
        sortedComments() {
            return this.comments.slice().sort((a, b) => {
                if (this.sort === '1') {
                    return new Date(b.datePosted) - new Date(a.datePosted);
                }
                return new Date(a.datePosted) - new Date(b.datePosted);
            });
        },
    },
    methods: {
        ...mapActions(['newAudio', 'toggleAudio']),
        async addComment(values, { resetForm }) {
            this.comment_in_submission = true;
            this.comment_show_alert = true;
            this.comment_alert_variant = 'bg-blue-500';
            this.comment_alert_message = 'Please wait! your comment is being submitted. ';
            
            const comment = {
                content: values.comment,
                datePosted: new Date().toString(),
                aid: this.$route.params.id,
                name: auth.getAuth().currentUser.displayName,
                uid: auth.getAuth().currentUser.uid,
            };
            try {
                const docRef = await db.addDoc(commentsCollection, comment);
                this.comment_alert_variant = 'bg-green-500';
                this.comment_alert_message = 'Comment Posted Succefully!';
                this.audio.comment_count += 1;
                console.log(this.audio);
                const audioRef = db.doc(database, 'audios', this.$route.params.id);
                await db.updateDoc(audioRef, {
                    comment_count: this.audio.comment_count
                });
                this.getComments();
                console.log(docRef);
            } catch (error) {
                this.comment_alert_variant = 'bg-red-500';
                this.comment_alert_message = 'Failed to post the comment, Please try again later.';
                console.log(error);
            }
            this.comment_in_submission = false;
            resetForm();
        },
        async getComments() {
            const q = db.query(commentsCollection,
            db.where("aid", "==", this.$route.params.id));
            const querySnapshot = await db.getDocs(q);
            this.comments = [];
            querySnapshot.forEach((doc) => {
                const comment = {
                ...doc.data(),
                docID: doc.id,
                };
                this.comments.push(comment);
            });
        },
    },
    async created() {
          // on first load
          const docRef = db.doc(
              database, 'audios', `${this.$route.params.id}`
              );
        const querySnapshot = await db.getDoc(docRef);
        console.log(querySnapshot);
        if (!querySnapshot.exists()) {
            this.$router.push({ name: 'home' });
            return; 
        }
        const { sort } = this.$route.query;
        if (sort === '1' || sort === '2') {
            this.sort = sort;
        }
        console.log("sort value: ", this.sort);
        this.getComments();
        this.audio = querySnapshot.data();
    },
    watch: {
        sort(newVal) {
            this.$router.push({
                query: {
                    sort: newVal,
                },
            });
        }
    },
};
</script>

<style>

</style>
