import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.min.css'
// import Vue from "vue/types/index"; // mint-ui

import {
  ActionSheet,
  Button,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  DatetimePicker,
  DropdownMenu,
  DropdownItem,
  Field,
  Icon,
  List,
  NavBar,
  Picker,
  Popup,
  PullRefresh,
  RadioGroup,
  Radio,
  Tab,
  Tabs,
  Toast,
  Search,
  Swipe,
  SwipeItem,
  Circle,
  Progress
} from 'vant'
import 'vant/lib/index.css'

Vue.use(ActionSheet)
Vue.use(Cell).use(CellGroup)
Vue.use(Checkbox).use(CheckboxGroup)
Vue.use(Button)
Vue.use(DatetimePicker)
Vue.use(DropdownMenu).use(DropdownItem)
Vue.use(Field)
Vue.use(Icon)
Vue.use(List)
Vue.use(NavBar)
Vue.use(Tab).use(Tabs)
Vue.use(Toast)
Vue.use(Picker)
Vue.use(Popup)
Vue.use(PullRefresh)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Search)
Vue.use(Swipe).use(SwipeItem)
Vue.use(Circle)
Vue.use(Progress)
Vue.use(MintUI)
