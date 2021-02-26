<template>
  <div style="margin-top: 20px">
    <div class="row">
      <div class="col-9">
        <h4>Event</h4>
      </div>

      <div class="col-3"></div>
    </div>

    <div class="card mt-3">
      <div class="card-header">
        List Events
        <b-button class="float-right" variant="primary" v-b-modal.add-event v-on:click="addItem()" >
          <i class="fas fa-plus"></i> Add Event</b-button
        >
      </div>
      <div class="card-body">
        <div class="row mt-3">
          <div class="col-12 table-responsive">
            <b-table
              striped
              hover
              :fields="fields"
              :items="items"
              :per-page="perPage"
              :current-page="currentPage"
            >
               <template #cell(status)="data">
               <span
              class="badge"
              v-bind:class="{
                'bg-success': data.item.status == 'active',
                'bg-danger': data.item.status == 'inactive',
              }"
              >{{ data.item.status }}
              </span>
              </template>

              <template #cell(createdAt)="data">
                <timeago :datetime="data.item.createdAt"></timeago>
                <!-- {{ data.index + 1 }} -->
              </template>
              <template #cell(startDate)="data">
                <timeago :datetime="data.item.startDate"></timeago>
                <!-- {{ data.index + 1 }} -->
              </template>

              <template #cell(actions)="data">
                <a
                  href="#"
                  class="mr-2 text-success"
                  v-on:click="viewItem(data.item)"
                  ><b-icon icon="eye-fill"></b-icon
                ></a>
                <a
                  href="#"
                  class="mr-2 text-info"
                  v-on:click="editItem(data.item)"
                  v-b-modal.add-event
                  ><b-icon icon="pencil-square"></b-icon
                ></a>
                <a
                  href="#"
                  class="text-danger"
                  v-on:click="showDeleteModal(data.item)"
                  ><b-icon icon="trash"></b-icon
                ></a>
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

    <b-modal id="add-event" title="Add Event" size="xl">
      <div class="row">
        <div class="col-md-6">
          <b-img thumbnail fluid :src="imageData"></b-img>
          <div v-if="isLoding"><b-spinner variant="primary" label="Spinning"></b-spinner> Loading...</div>

        </div>
        <div class="col-md-6">
          <form @submit.prevent="submitForm()">
            <div class="form-group">
              <label for="">Name</label>
              <input
                type="text"
                class="form-control"
                placeholder="Enter name here"
                v-model="form.name"
              />
            </div>

            <div class="form-group">
              <label for="">Status</label>
              <select name="" id="" class="form-control" v-model="form.status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label for="">Start Date</label>
                  <date-picker
                    v-model="form.startDate"
                    :config="options"
                  ></date-picker>
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="">Expiration</label>
                  <date-picker
                    v-model="form.endDate"
                    :config="options"
                  ></date-picker>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="">Content</label>
              <wysiwyg v-model="form.content" />
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

      <template #modal-footer="{ cancel }">
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
          @click="saveEvent()"
        >
          Save
        </b-button>
      </template>
    </b-modal>

    <b-modal id="delete-event" title="Delete Event">
      <div class="d-block">
        <p>
          This action is irreversible. Do you want to delete
          <b>{{ selectedEventName }}</b> department?
        </p>
      </div>
      <template #modal-footer="{ cancel }">
        <b-button
          variant="secondary"
          size="sm"
          class="float-right"
          @click="cancel()"
        >
          Close
        </b-button>
        <b-button
          variant="danger"
          size="sm"
          class="float-right"
          @click="deleteEvent(selectedEventId)"
        >
          Delete
        </b-button>
      </template>
    </b-modal>

    <!-- 
      view event modal
  -->

    <b-modal id="view-event" title="View Event" size="lg" hide-footer>
      <div class="row" v-if="selectedEvent != null">
        <div class="col-7">
          <b-img thumbnail fluid :src="selectedEvent.imageUrl"></b-img>
            
        </div>
        <div class="col-5">
          <p><b>Name: </b>{{ selectedEvent.name }}</p>
          <p><b>Start Date: </b> {{ (new Date(selectedEvent.startDate)).toLocaleString()}} </p>
          <p><b>End Date: </b>{{(new Date(selectedEvent.endDate)).toLocaleString()}} </p>
          
          <p>
            Status:
            <span
              class="badge"
              v-bind:class="{
                'bg-success': selectedEvent.status == 'active',
                'bg-danger': selectedEvent.status == 'inactive',
              }"
              >{{ selectedEvent.status }}</span
            >
          </p>
          <p><b>Details: </b><span v-html="selectedEvent.content"></span></p>

        </div>
      </div>
    </b-modal>
  </div>
</template>

 <script>
import api from "../services/api";

export default {
  data() {
    return {
      rows: 1,
      isLoding: false,
      currentPage: 1,
      perPage: 5,
      eventImageFile: "",
      imageData:
        "https://www.liberaldictionary.com/wp-content/uploads/2019/02/department-7600.jpg",
      myHTML: "",
      file: null,
      selectedEvent: null,
      selectedEventId: "",
      selectedEventName: "",
      imageUrl: "",
      form: {
        name: "",
        status: "",
        content: "",
        startDate: Date.now(),
        endDate: Date.now(),
        imageUrl: "",
      },
      date: new Date(),
      options: {
       // format: "DD/MM/YYYY h:mm:ss",
        useCurrent: false,
      },
      fields: [
        "id",
        "name",
        "status",
        { key: "startDate", label: "Start Date" },
        { key: "createdAt", label: "Created On" },
        "actions",
      ],
      items: [],
      get itemsForList() {
        return this.data.slice(
          (this.currentPage - 1) * this.perPage,
          this.currentPage * this.perPage
        );
      },
    };
  },
  methods: {
    showDeleteModal(data) {
      this.selectedEventId = data.id;
      this.selectedEventName = data.name;
      this.$bvModal.show("delete-event");
    },
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
    viewItem(data) {
      this.selectedEvent = data;
      this.$bvModal.show("view-event");
    },
    addItem(){
      this.imageData = "https://www.liberaldictionary.com/wp-content/uploads/2019/02/department-7600.jpg",
      this.form = {};
    },
    editItem(data) {
      this.form = {
        id: data.id,
        name: data.name,
        status: data.status,
        content: data.content,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      };
      this.imageData = data.imageUrl;
      console.log(data);
    },
    upload(event) {
      //call preview
      this.previewImage(event);
      this.eventImageFile = new FormData();
      this.file = event.target.files[0];
      this.eventImageFile.append("name", "my-file");
      this.eventImageFile.append("document", this.file);
      console.log(this.eventImageFile);
    },

    //fetch Departments
    fetchData() {
      api
        .get("/event")
        .then((response) => {
          this.items = response.data.data;
          this.rows = this.items.length;
          //console.log(response.data)
        })
        .catch((error) => console.error(error))
        .finally(() => {
          console.log("Hello here");
        });
    },
    deleteEvent(id) {
      api
        .delete(`/event/${id}`)
        .then((response) => {
          console.log(response);
          this.$bvModal.hide("delete-event");
          this.$toastr.s("Event deleted   👍");
          this.fetchData();
        })
        .catch((error) => console.log(error));
    },
    async uploadImage() {
      api
        .post("/upload/cloud", this.eventImageFile)
        .then((data) => {
          this.form.imageUrl = data.data.data.url;
          this.persitData();
          return this.form;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    saveEvent() {
       this.isLoding = true
      if (this.eventImageFile) {
        this.uploadImage();
      } else {
        this.persitData();
      }
    },
    persitData() {
      console.log(this.form.startDate, this.form.endDate)
     
      if (this.form.id) {
        api
          .patch("/event", this.form)
          .then(() => {
            this.$toastr.s("Event updated successfully   👍");
            this.$bvModal.hide("add-event");
            this.fetchData();
          })
          .catch((error) => {
            console.log(error);
          }).finally(()=>{
            this.isLoding = false
          });
      } else {
        api
          .post("/event", this.form)
          .then(() => {
            this.$toastr.s("Event added successfully   👍");
            this.$bvModal.hide("add-event");
            this.fetchData();
          })
          .catch((error) => {
            console.log(error);
            
          }).finally(()=>{
            this.isLoding = false
          });
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>