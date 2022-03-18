import { createApp } from 'vue'

import router from './router'
import store from './store'
import App from './App.vue'

// Design
import { FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCommentDots, faEdit, faTrash, faImage, faPaperPlane, faPowerOff, faHouseUser } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap' 
import 'bootstrap/dist/css/bootstrap.min.css'

import interceptor from "./helpers/interceptor"

// Importation icons
library.add(faCommentDots, faEdit, faTrash, faImage, faPaperPlane, faPowerOff, faHouseUser)

// Création app
createApp(App)

    .use(store)
    .use(router)
    .component('fa', FontAwesomeIcon)
    .mount('#app')
    interceptor();
