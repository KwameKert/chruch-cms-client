<template>
  <div style="margin-top: 20px">
    <div class="row">
      <div class="col-9">
        <h4>Sermon</h4>
      </div>

      <div class="col-3"></div>
    </div>

    <div class="card mt-3">
      <div class="card-header">
        List Sermons
        <b-button class="float-right" variant="primary" v-b-modal.add-sermon>
          <i class="fas fa-plus"></i> Add Sermon</b-button
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
                  v-b-modal.add-sermon
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

    <b-modal id="add-sermon" title="Add Sermon">
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
              <label for="">Url </label>
              <input type="text" class="form-control" v-model="form.url" />
            </div>
            <div class="form-group">
              <label for="">Description</label>
              <wysiwyg v-model="form.description" />
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

    <b-modal id="view-sermon" title="View Sermon" size="lg" hide-footer>
      <div class="row" v-if="selectedSermon != null">
        <div class="col-7">
          <iframe
            width="450"
            height="315"
            :src="selectedSermon.url"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div class="col-5">
          <p><b>Title: </b>{{ selectedSermon.title }}</p>
          <p><b>Description: </b>{{ selectedSermon.description }}</p>
          <p>
            Status:
            <span
              class="badge"
              v-bind:class="{
                'bg-success': selectedSermon.status == 'active',
                'bg-danger': selectedSermon.status == 'inactive',
              }"
              >{{ selectedSermon.status }}</span
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
      selectedSermon: null,
      form: {
        title: "",
        description: "",
        status: "",
        url: "",
      },
      fields: [
        "id",
        "title",
        "url",
        "description",
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
        .get("/sermon")
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
        description: data.description,
        status: data.status,
        url: data.url,
      };
      console.log(data);
    },
    viewItem(data) {
      this.selectedSermon = data;
      this.$bvModal.show("view-sermon");
    },
    persitData() {
      console.log("persit data ", this.form);
      if (this.form.id) {
        api
          .patch("/sermon", this.form)
          .then(() => {
            this.$toastr.s("Sermon updated successfully   👍");
            this.$bvModal.hide("add-sermon");
            this.fetchData();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        api
          .post("/sermon", this.form)
          .then(() => {
            this.fetchData();
            this.$toastr.s("Sermon added successfully   👍");
            this.$bvModal.hide("add-sermon");
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
