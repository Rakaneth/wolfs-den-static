import Vue from 'vue'
import App from './views/app'

let MainComponent = Vue.extend(App)
new MainComponent().$mount('#gui')

