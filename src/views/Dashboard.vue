<template>
    <div>
        <div class="row mt-3 ">
            <div class="col-4">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-3">
                                 <i class="fab fa-youtube d-icon"></i>
                            </div>
                            <div class="col-9 text-center">
                                <p class="lead">No. Sermons</p>
                                <h4>{{sermons}}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-3">
                                <i class="fas fa-calendar d-icon"></i>
                               
                            </div>
                            <div class="col-9 text-center">
                                <p class="lead">No. Events</p>
                                <h4>{{events}}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-4">
                  <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-3">
                        <i class="fas fa-clock d-icon"></i>
                            </div>
                            <div class="col-9 text-center">
                                <p class="lead">Next Event </p>
                                <h4>{{nextEvent}}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import api from "../services/api";
import moment from 'moment';
export default {
    data(){
        return{
            sermons:0,
            events:0,
            verses:0,
            nextEvent:null,
        }
    },methods: {
        fetchData(){
            api
        .get("/auth/dashboard")
        .then((response) => {
            let data = response.data.data;
          if (data) {
             this.sermons = data.sermons;
             this.events = data.events;
             this.verses = data.verses;
             this.nextEvent = moment(data.nextEvent.endDate).format("DD-MM-YYYY");
             const date1 = new Date();
             const date2 = new Date(data.nextEvent.endDate);
             const diffTime = date2 - date1;
             const diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
             const diffMinutes = Math.ceil(diffTime / (1000 * 60 )); 
            if(diffHours<24 && diffMinutes > 1){
                this.dateUpdate(diffTime)
            }
         }
          //console.log(response.data)
        })
        .catch((error) => console.error(error))
        .finally(() => {});
        },
    
        dateUpdate(endDate){
            var secondsLeft = endDate
            setInterval(()=>{
             let date = new Date(secondsLeft);
             this.nextEvent =moment(date).format("h:mm:ss");  
             secondsLeft = secondsLeft -1000;
            },1000)
        }
    },
    mounted() {
        this.fetchData()
    }
}
</script>

<style >
.d-icon{
    font-size: 45px;
    margin: 12px;
}
</style>