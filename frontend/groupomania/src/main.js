import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCommentDots, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap' 
import 'bootstrap/dist/css/bootstrap.min.css'
import interceptor from "./helpers/interceptor"

library.add(faCommentDots, faEdit, faTrash)

createApp(App)
    .use(store)
    .use(router)
    .component('fa', FontAwesomeIcon)
    .mount('#app')
    interceptor();
