!<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
              <div >
                <h4 class="inline-block text-2xl font-bold">{{ audio.modified_name }}</h4>
                <button 
                class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
                @click.prevent="deleteAudio"
                >
                  <i class="fa fa-times"></i>
                </button>
                <button
                 class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                 @click.prevent="showForm = !showForm"
                 >
                  <i class="fa fa-pencil-alt"></i>
                </button>
              </div>
              <div v-show="showForm">
                  <div 
                  class="text-white text-center font-bold p-2 mb-4 mt-4"
                  v-if="show_alert"
                  :class="alert_variant"
                  >
                  {{ alert_message }}
                  </div>
                <vee-form :validation-schema="schema" :initial-values="audio"
                @submit="edit">
                  <div class="mb-3">
                    <label class="inline-block mb-2">Audio Title</label>
                    <vee-field type="text" name="modified_name"
                      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                      placeholder="Enter new Title" 
                      @input="updateUnsavedFlag(true)"
                      />
                      <ErrorMessage class="text-red-600" name="modified_name"/>
                  </div>
                  <div class="mb-3">
                    <label class="inline-block mb-2">Genre</label>
                    <vee-field type="text" name="genre"
                      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                      placeholder="Enter Genre"
                    @input="updateUnsavedFlag(true)"
                          />
                      <ErrorMessage class="text-red-600" name="genre"/>
                  </div>
                  <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600"
                  :disabled="in_submission">
                    Submit
                  </button>
                  <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600"
                  :disabled="in_submission" @click.prevent="showForm = false">
                    Go Back
                  </button>
                </vee-form>
              </div>
            </div>
</template>

<script>
import { 
    database,
//   auth,
   db,
   storageGroup,
   storage,
    // audiosCollection
  } from '@/includes/firebase';

export default {
name: 'CompositionItem',
props: {
    audio: {
        type: Object,
        required: true,
    },
    updateAudio: {
        type: Function,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
    removeAudio: {
        type: Function,
        required: true,
    },
    updateUnsavedFlag:
    {
        type: Function,
    },
},
data() {
    return {
        showForm: false,
        schema: {
            modified_name: 'required',
            genre: 'alphaSpaces'
        },
        in_submission: false,
        show_alert: false,
        alert_variant: 'bg-blue-500',
        alert_message: 'Please wait! Updating Audio file info.',
    };
},
methods: {
    async edit(values) {
        this.in_submission = true;
        this.show_alert = true;
        this.alert_variant = 'bg-blue-500';
        this.alert_message = 'Please wait! Updating Audio file info.';
        console.log(values);
    try {
        const audioRef = db.doc(database, 'audios', this.audio.docID);
        await db.updateDoc(audioRef, values);
    } catch (error) {
     this.in_submission = false;   
     this.alert_variant = 'bg-red-500';
     this.alert_message = 'Updating failed, try again later';
     console.log(error);
     return;
    }
    this.in_submission = false;  
    this.alert_variant = 'bg-green-500';
    this.alert_message = 'Updated Succefully!';
    this.updateAudio(this.index, values);
        console.log('audio editted');
        this.updateUnsavedFlag(false);
    },
    async deleteAudio() {
        console.log('deleteing');
        await db.deleteDoc(db.doc(database, "audios", this.audio.docID));

        // Create a reference to the file to delete
        const fileRef = storageGroup.ref(storage, `audio/${this.audio.original_name}`);
        // Delete the file
        storageGroup.deleteObject(fileRef).then(() => {
        // File deleted successfully
        console.log(' successfulyl deleted');
        this.removeAudio(this.index);
        }).catch((error) => {
        // Uh-oh, an error occurred!
        console.log('Deletion Failed:', error);
        });
    },
},
};
</script>

<style>

</style>
