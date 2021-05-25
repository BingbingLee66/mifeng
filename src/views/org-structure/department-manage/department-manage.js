export default {
  data() {
    return {
      tableData: [{
        id: 1,
        name: '广东省江西商会',
        num: 3,
        children: [{
          id: 2,
          name: '理事会',
          num: 10,
          children: [{
            id: 3,
            name: '理事会',
            num: 10
          }, {
            id: 4,
            name: '秘书处',
            num: 9
          }, {
            id: 5,
            name: '委员会',
            num: 6
          }]
        }, {
          id: 6,
          name: '秘书处',
          num: 9
        }, {
          id: 7,
          name: '委员会',
          num: 6
        }]
      }]
    }
  },
  computed: {},
  created() {
  },
  methods: {
    editName(e, row) {
      console.log(e, row)
    }
  }
}
