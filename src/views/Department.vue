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

                    <b-table striped hover :fields="fields" :items="items">
                          <template #cell(index)="data">
                                {{ data.index + 1 }}
                            </template>

                          <template #cell(createdAt)="data">
                              <timeago :datetime="data.item.createdAt"></timeago>
                                <!-- {{ data.index + 1 }} -->
                            </template>
                    </b-table>
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
                    <form >
                
               <div class="form-group">
                   <label for="">Name</label>
                   <input type="text" class="form-control" placeholder="Enter name here">
               </div>

               <div class="form-group">
                   <label for="">Status</label>
                   <select name="" id="" class="form-control">
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
                     <wysiwyg v-model="myHTML" />
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
            </template>
        </b-modal>  


    </div>
    
</template>

<script>
import api from '../services/api';
export default {
    data(){
        return {
      //  show: false,
        departmentImageFile: '', 
        imageData:'https://www.liberaldictionary.com/wp-content/uploads/2019/02/department-7600.jpg',
        myHTML:'',
        file: null,    
        fields: [
          'index',
          'name',
          'content',
          {key: 'createdAt', label: 'Created On'}
        ],
          items: [],
     
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
            //console.log(response.data)
        }).catch(error=> console.error(error))
        .finally(()=>{
            console.log("Hello here")
        })
    },
    uploadImage(){
        api.post('/upload/cloud',this.departmentImage).then(data=>{
            console.log(data)
        }).catch(error=>{
            console.log(error);
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