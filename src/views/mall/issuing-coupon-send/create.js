import { createActivity, uploadPortrait, getActivity } from '@/api/activity/activity'
import Ckeditor from '@/components/CKEditor'
import area from '@/utils/area'
import draggable from 'vuedraggable' // 拖拽组件
import { getChamberOptions } from '@/api/finance/finance'
export default {
  components: {
    Ckeditor,
    draggable
  },
  data() {
    return {
      couponListDrag: false,
      ruleForm: {
        couponList: ['133365', '133365'],
        receive: '',
        phone: '',
        ckey: ''
      },
      chamberOptions: [],
      showPhoneInput: false,
      showChamberSelect: false
    }
  },
  created() {
    this.getChamberOptions()
  },
  methods: {
    couponListStart() {
      this.couponListDrag = true
    },
    couponListEnd(evt) {
      this.couponListDrag = false
    },
    addCoupon() {
      this.ruleForm.couponList.push('')
    },
    delCoupon(index) {
      this.ruleForm.couponList.splice(index, 1);
    },
    handleChange(e) {
      if (e === '1') {
        this.showPhoneInput = true
      } else if (e === '2') {
        this.showChamberSelect = true
      }
    },
    getChamberOptions() {
      getChamberOptions().then(response => {
        this.chamberOptions = response.data.data
      })
    },
    submitForm() {
      console.log(123);
    },
  }
}
