<template>
    <div style="margin-top: 20px">
        <div class="row">
            <div class="col-9">
                <h4>Department</h4>
            </div>

            <div class="col-3">

       
            </div>
        </div>

    <div class="card mt-3">
        <div class="card-header">
            List Department
            <b-button class=" float-right" variant="primary" v-b-modal.add-department> <i class="fas fa-plus"></i> Add Department</b-button>
        </div>
        <div class="card-body">
            <div class="row  mt-3">
                <div class="col-12 table-responsive">

                    <b-table striped hover :fields="fields" :items="items" :per-page="perPage"
      :current-page="currentPage">
                          <template #cell(content)="data">
                                {{ data.item.content.slice(0, 100)  }}...
                            </template>

                          <template #cell(createdAt)="data">
                              <timeago :datetime="data.item.createdAt"></timeago>
                                <!-- {{ data.index + 1 }} -->
                            </template>
                    </b-table>

                      <b-pagination
                      class="mt-3 float-right"
                        v-model="currentPage"
                        :total-rows="rows"
                        :per-page="perPage"
                        aria-controls="itemList"
                        align="center"
                        ></b-pagination>
                </div>
            </div>
        </div>
    </div>

       <b-modal id="add-department" title="Add Department" size="xl" >
           <div class="row">
               <div class="col-md-6">
                    <b-img
                  thumbnail
                  fluid
                  :src="imageData"
                ></b-img>
               </div>
               <div class="col-md-6">
                    <form @submit.prevent="submitForm()">
                
               <div class="form-group">
                   <label for="">Name</label>
                   <input type="text" class="form-control" placeholder="Enter name here" v-model="form.name">
               </div>

               <div class="form-group">
                   <label for="">Status</label>
                   <select name="" id="" class="form-control"  v-model="form.status">
                       <option value="active">
                           Active
                       </option>
                         <option value="inactive">
                           Inactive
                       </option>
                   </select>
               </div>

                <div class="form-group">
                    <label for="">Content</label>
                     <wysiwyg v-model="form.content"  />
                </div>

                <div class="form-group">
                    <label for="">Image </label>
                        <b-form-file
                        v-model="file"
                        :state="Boolean(file)"
                        @change="upload($event)"
                        placeholder="Choose a file or drop it here..."
                        drop-placeholder="Drop file here..."
                        ></b-form-file>
                </div>
 
           </form>
               </div>
           </div>
          
           <template #modal-footer="{  cancel }">
                 <b-button
                variant="secondary"
                size="sm"
                class="float-right"
                @click="cancel()"
                >
            Close
          </b-button>
                 <b-button
                variant="success"
                size="sm"
                class="float-right"
                @click="saveDepartment()"
                >
            Save
          </b-button>
            </template>
        </b-modal>  


    </div>
    
</template>

<script>
import api from '../services/api';
import axios from 'axios';
//const config = { headers: { 'Content-Type': 'multipart/form-data' } };

export default {
    data(){
        return {
      //  show: false,
        rows :1,
        currentPage:1,
         perPage : 5,
        departmentImageFile: '', 
        imageData:'https://www.liberaldictionary.com/wp-content/uploads/2019/02/department-7600.jpg',
        myHTML:'',
        file: null,   
        imageUrl: '', 
        form: {
            name: '',
            status: '',
            content: '',
            imageUrl: ''

        },
        fields: [
          'id',
          'name',
          'content',
          {key: 'createdAt', label: 'Created On'}
        ],
          items: [],
            get itemsForList() {
                return this.data.slice(
                (this.currentPage - 1) * this.perPage,
                this.currentPage * this.perPage,
                );
            }
     
        }
    }, methods: {
       previewImage: function (event) {
        var input = event.target;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = (e) => {
            this.imageData = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    },
    upload(event) {
      //call preview
      this.previewImage(event);
      this.departmentImageFile = new FormData();
      this.file = event.target.files[0];
      this.departmentImageFile.append("name", "my-file");
      this.departmentImageFile.append("document", this.file);
      console.log(this.departmentImageFile)
    },
        //fetch Departments
    fetchData(){
        api.get('/department').then((response)=>{
            this.items = response.data.data;
            this.rows = this.items.length;
            //console.log(response.data)
        }).catch(error=> console.error(error))
        .finally(()=>{
            console.log("Hello here")
        })
    },
    async uploadImage(){
        axios.post('http://localhost:3000/api/upload/cloud', this.departmentImageFile).then(data=>{
         this.form.imageUrl = data.data.data.url
         this.persitData();
           return this.form
        }).catch(error=>{
            console.log(error);
        })
    },
    saveDepartment(){
        if(this.departmentImageFile){
            this.uploadImage()
        }else{
            this.persitData();
        }
     
    },
    persitData(){
    console.log("persit data ", this.form)
     api.post('/department', this.form).then(()=>{
                this.fetchData();
            }).catch((error)=>{
                console.log(error)
            })
    }

    },
    mounted() {
        this.fetchData();
    }
}
</script>

<style >

</style>