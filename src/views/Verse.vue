<template>
  <div style="margin-top: 20px">
    <div class="row">
      <div class="col-9">
        <h4>Verse</h4>
      </div>

      <div class="col-3"></div>
    </div>

    <div class="card mt-3">
      <div class="card-header">
        List Verses
        <b-button class="float-right" variant="primary" v-b-modal.add-verse>
          <i class="fas fa-plus"></i> Add Verse</b-button
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
              <template #cell(description)="data">
                {{ data.item.description.slice(0, 100) }}...
              </template>
              <template #cell(url)="data">
                {{ data.item.url.slice(0, 10) }}...
              </template>

              <template #cell(createdAt)="data">
                <timeago :datetime="data.item.createdAt"></timeago>
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
                  v-b-modal.add-verse
                  ><b-icon icon="pencil-square"></b-icon
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

    <b-modal id="add-verse" title="Add verse">
      <div class="row">
        <div class="col-md-12">
          <form @submit.prevent>
            <div class="form-group">
              <label for="">Title</label>
              <input
                type="text"
                class="form-control"
                placeholder="Enter title here"
                v-model="form.title"
              />
            </div>

            <div class="form-group">
              <label for="">Status</label>
              <select name="" id="" class="form-control" v-model="form.status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div class="form-group">
              <label for="">Content</label>
              <wysiwyg v-model="form.content" />
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
          @click="persitData()"
        >
          Save
        </b-button>
      </template>
    </b-modal>

    <b-modal id="view-verse" title="View Verse"  hide-footer>
      <div class="row" v-if="selectedVerse != null">
        
        <div class="col-12">
          <p><b>Title: </b>{{ selectedVerse.title }}</p>
          <p><b>Content: </b>{{ selectedVerse.content }}</p>
          <p>
            <b>Status: </b>
            <span
              class="badge"
              v-bind:class="{
                'bg-success': selectedVerse.status == 'active',
                'bg-danger': selectedVerse.status == 'inactive',
              }"
              >{{ selectedVerse.status }}</span
            >
          </p>
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
      currentPage: 1,
      perPage: 5,
      selectedVerse: null,
      form: {
        title: "",
        content: "",
        status: ""
      },
      fields: [
        "id",
        "title",
        "content",
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
    fetchData() {
      api
        .get("/verse")
        .then((response) => {
          if (response.data.data) {
            this.items = response.data.data;
            this.rows = this.items.length;
          }
          //console.log(response.data)
        })
        .catch((error) => console.error(error))
        .finally(() => {});
    },
    editItem(data) {
      this.form = {
        id: data.id,
        title: data.title,
        content: data.content,
        status: data.status
      };
      console.log(data);
    },
    viewItem(data) {
      this.selectedVerse = data;
      this.$bvModal.show("view-verse");
    },
    persitData() {
      console.log("persit data ", this.form);
      if (this.form.id) {
        api
          .patch("/verse", this.form)
          .then(() => {
              console.log(this.form)
            this.$toastr.s("Verse updated successfully   👍");
            this.$bvModal.hide("add-verse");
            this.fetchData();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        api
          .post("/verse", this.form)
          .then(() => {
            this.fetchData();
            this.$toastr.s("Verse added successfully   👍");
            this.$bvModal.hide("add-verse");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
