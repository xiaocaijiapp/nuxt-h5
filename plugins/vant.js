import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
import {
  Field,
  NavBar,
  Icon,
  CellGroup,
  Checkbox,
  Form,
  Tab,
  Tabs,
  Swipe,
  SwipeItem,
  Image as VanImage,
  CountDown,
  SubmitBar,
  Card,
  CheckboxGroup,
  Stepper,
  Sidebar,
  SidebarItem,
  Search,
  Button,
  Cell,
  Dialog,
  RadioGroup,
  Radio,
  NoticeBar,
  Sticky,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Sku,
  Area,
  ActionSheet,
  NumberKeyboard,
  Rate,
  SwipeCell,
  List,
  Popup,
  Uploader,
  Toast,
  DatetimePicker,
  Empty,
  Tabbar,
  TabbarItem,
  Overlay,
  Lazyload,
  ShareSheet,
  Divider,
  Loading
} from 'vant'
const loading = require('../assets/images/loading/default-lg.png')
const error = require('../assets/images/loading/default-lg.png')
Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  attempt: 1,
  loading,
  error
})
Vue.use(Lazyload, {
  lazyComponent: true,
  loading,
  error,
  attempt: 1
})
Vue.use(Field)
  .use(Loading)
  .use(Overlay)
  .use(Form)
  .use(Button)
  .use(NavBar)
  .use(Icon)
  .use(CellGroup)
  .use(Checkbox)
  .use(Tab)
  .use(Tabs)
  .use(Swipe)
  .use(SwipeItem)
  .use(VanImage)
  .use(CountDown)
  .use(SubmitBar)
  .use(Card)
  .use(CheckboxGroup)
  .use(Stepper)
  .use(Sidebar)
  .use(SidebarItem)
  .use(Search)
  .use(Cell)
  .use(Dialog)
  .use(RadioGroup)
  .use(Radio)
  .use(NoticeBar)
  .use(Sticky)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Sku)
  .use(Area)
  .use(ActionSheet)
  .use(NumberKeyboard)
  .use(Rate)
  .use(SwipeCell)
  .use(List)
  .use(Popup)
  .use(Uploader)
  .use(Toast)
  .use(DatetimePicker)
  .use(Empty)
  .use(Tabbar)
  .use(TabbarItem)
  .use(ShareSheet)
  .use(Divider)
