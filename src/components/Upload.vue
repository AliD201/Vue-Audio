<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">Upload</span>
            <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Upload Dropbox -->
            <div
              class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
                :class="{'bg-green-400 border-green-400 border-solid hover:text-white': is_dragover}
                "
                @drag.prevent.stop=""
                @dragstart.prevent.stop=""
                @dragend.prevent.stop="is_dragover = false"
                @dragover.prevent.stop="is_dragover = true"
                @dragenter.prevent.stop="is_dragover = true"
                @dragleave.prevent.stop="is_dragover = false"
                @drop.prevent.stop="upload($event)"
                >
              <h5>Drop your files here</h5>
            </div>
            <input type="file" multiple @change="upload($event)" />
            <hr class="my-6" />
            <!-- Progess Bars -->
            <div class="mb-4" v-for="upload in uploads" :key="upload.name">
              <!-- File Name -->
              <div class="font-bold text-sm" :class="upload.text_class">
                <i :class="upload.icon"></i>
                {{ upload.name }}
                </div>
              <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                <!-- Inner Progress Bar -->
                <div class="transition-all progress-bar "
                :class= "upload.variant"
                :style="{ width: upload.current_progress + '%' }"
                 ></div>
              </div>
            </div>
          </div>
        </div>
</template>

<script>
import {
   storageRef, storage, storageGroup, auth,
    database, db
   } from '@/includes/firebase';

export default {
    name: 'Upload',
    props: {
      addAudio: {
        type: Function,
        required: true,
      }
    },
    data() {
      return {
        is_dragover: false,
        uploads: [],
      };
    },
    methods: {
      upload($event) {
        this.is_dragover = false;
        
        const files = $event.dataTransfer 
        ? [...$event.dataTransfer.files] : [...$event.target.files];

        files.forEach((file) => {
          // check file type
          if (file.type !== 'audio/mpeg') {
            if (file.type !== 'audio/mp4') {
              console.log('returned');
              return;
            }
            console.log('returned');
            return;
          }
          // upload location
          const audioRef = storageGroup.ref(storage, `audio/${file.name}`);
          // upload 
          const uploadTask = storageGroup.uploadBytesResumable(audioRef, file);
          // .then((snapshot) => {
          //   console.log('Uploaded a blob or file!');
          //   console.log(snapshot);
          // });

          const uploadIndex = this.uploads.push({
            uploadTask,
            current_progress: 0,
            name: file.name,
            variant: 'bg-blue-400',
            icon: 'fas fa-spinner fa-spin',
            text_class: '',
          }) - 1;
          // Register three observers:
          // 1. 'state_changed' observer, called any time the state changes
          // 2. Error observer, called on failure
          // 3. Completion observer, called on successful completion
          uploadTask.on('state_changed', (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of
              // bytes uploaded and the total number of bytes to be uploaded
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              this.uploads[uploadIndex].current_progress = progress;
              console.log('Upload is ' + this.uploads[uploadIndex].current_progress + '% done');
              
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
              }
            }, 
            (error) => {
              // Handle unsuccessful uploads
              this.uploads[uploadIndex].variant = 'bg-red-400';
              this.uploads[uploadIndex].icon = 'fas fa-times';
              this.uploads[uploadIndex].text_class = 'text-red-400';
              console.log(error);
            }, 
            () => {
              const song = {
                uid: auth.getAuth().currentUser.uid,
                display_name: auth.getAuth().currentUser.displayName,
                original_name: uploadTask.snapshot.ref.name,
                modified_name: uploadTask.snapshot.ref.name,
                genre: '',
                comment_count: 0,
              };
              console.log(song);

              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              storageGroup.getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                console.log('File available at', downloadURL);
                song.url = downloadURL;
                console.log(song);

                const docRef = await db.addDoc(db.collection(database, "audios"),
                song);
                song.docID = docRef.id;
                const updateList = song;
                console.log(updateList);
                this.addAudio(updateList);
                console.log(docRef);
                this.uploads[uploadIndex].variant = 'bg-green-400';
                this.uploads[uploadIndex].icon = 'fas fa-check';
                this.uploads[uploadIndex].text_class = 'text-green-400';
              });
            });
          console.log(storageRef);
        });
        console.log(files);
      },
      cancelUploads() {
        this.uploads.forEach((upload) => {
        upload.uploadTask.cancel();
      });
      },
    },
    beforeUnmount() {
      this.uploads.forEach((upload) => {
        upload.uploadTask.cancel();
      });
    },
};
</script>

<style>

</style>
