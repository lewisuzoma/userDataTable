import { createStore } from "vuex";

const store = createStore({
  state: {
    serverData: null,
  },
  getters: {
    getUsersData: state => state.serverData,
    getTotalPayable: (state) => {
      const res = state.serverData?.filter(payable => payable.payment_status !== 'paid') || []
      const totalAmount = res.reduce((total, payable) => {
        const amount = parseFloat(payable.amount)
        if(!isNaN(amount)) {
          return total + amount
        }
        return amount;
      }, 0)
      return totalAmount;
    } 
  },
  mutations: {
    setUsersData: (state, users) => {
      state.serverData = users;
    },
  },
  actions: {
    getUsers: (context, type) => {
      fetch('/data.json')
        .then(res=>res.json())
        .then(res=> {
          if (type !== 'all') {
            const users = res.data?.filter(users => users.payment_status == type)
            context.commit('setUsersData', users)
          } else {
            context.commit('setUsersData', res.data)
          }
        });
    },
  }
});

export default store;
