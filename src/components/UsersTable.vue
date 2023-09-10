<template>
  <p class="text-primary"><strong>Users Table</strong></p>
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a class="nav-link" :class="{'active': tab === 'all'}" aria-current="page" href="#" @click="filterPaymentStatus('all')">All</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': tab === 'paid'}" href="#" @click="filterPaymentStatus('paid')">Paid</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': tab === 'unpaid'}" href="#" @click="filterPaymentStatus('unpaid')">Unpaid</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': tab === 'overdue'}" href="#" @click="filterPaymentStatus('overdue')">Overdue</a>
      </li>
      <div class="text-primary ms-auto">
        <p >Total payable amount: <span class="text-secondary"><strong>{{ currencyFormatter.format(payable) }}USD</strong></span></p>
      </div>
    </ul>
    <DataTable
      :columns="columns"
      :data="users"      
      class="table myaccordion table-hover table-bordered"
      id="accordion"
      width="100%"
    >
      <thead>
        <tr data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
          <th>Name</th>
          <th>User Status</th>
          <th>Payment Status</th>
          <th>Amount</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
    </DataTable>
</template>

<script setup lang="ts">
import DataTable from 'datatables.net-vue3'
import DataTablesLib from 'datatables.net-bs5';

import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
// import { mapActions, mapGetters } from 'vuex';


DataTable.use(DataTablesLib);
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD', 
});

const tab = ref('all')

const columns = [
  { 
    data: null, 
    sortable: false,
    render(row: any) {
      return `<p class="fs-12 text-primary m-0 bold">${row.name}</p>
        <p class="m-0 fs-12">${row.email}</p>`;
    }, 
  },
  { data: null,
    sortable: false,
    render(row: any) {
      if(row.user_status == 'active'){
        return `<span class="badge badge-primary">&bull; Active</span>
            <p class="fs-12 m-0">Last login: ${row.last_login}</p>`;
      }
        return `<span class="badge badge-default">&bull; Inactive</span>
        <p class="fs-12 m-0">Last login: ${row.last_login}</p>`

    }
  },
  { 
    data: null,
    sortable: false,
    render(row: any) {
      if(row.payment_status == 'paid') {
        return `<span class="badge badge-success">&bull; Paid</span>
            <p class="fs-12 m-0">Paid date: ${row.paid_date}</p>`;
      }
      if(row.payment_status == 'unpaid') {
        return `<span class="badge badge-warning">&bull; Unpaid</span>
            <p class="fs-12 m-0">Dues on: ${row.paid_date}</p>`;
      }
      return `<span class="badge badge-danger">&bull; Overdue</span>
        <p class="fs-12 m-0">Dued on: ${row.paid_date}</p>`
    }, 
  },
  { 
    data: null,
    sortable: false,
    render(row: any) {
      return `<span>$${row.amount}</span>
        <p class="fs-12 m-0">USD</p>`
    }, 
  },
  { data: null, render: function(data: any) {
    return `<div class="d-flex align-items-center justify-content-center dropdownr">
              <span class="text-primary me-3 fs-12">View more</span><i class="fa fa-ellipsis-v fs-12" aria-hidden="true"></i>
              <ul class="dropdown-content">
                <li>View</li>
              </ul>
            </div>`;
  }, }
];

const store = useStore();

const users = computed(() => {
  return store.state.serverData;
});
const payable = computed(() => {
  return store.getters.getTotalPayable;
});

const filterPaymentStatus = (type: string) => {
  tab.value = type;
  store.dispatch('getUsers', type);
}

onMounted(() => {
  store.dispatch('getUsers', 'all');
})
</script>
<style>
@import 'bootstrap';
@import 'datatables.net-bs5';
@import 'datatables.net-select-bs5';

.bold {
  font-weight: bolder !important;
}
.fs-12{
  font-size: 12px !important;
}
.text-primary {
  color: #706a94 !important;
}
.text-secondary {
  color: #6d5bd0 !important;
}
.badge-primary {
  background-color: #f4f2ff !important;
  color: #6d5bd0 !important;
}
.badge-default {
  background-color: #f4f2ff !important;
  color: #706a94 !important;
}
.badge-success {
  background-color: #cdffcd !important;
  color: #007f00 !important;
}
.badge-danger {
  background-color: #ffe0e0 !important;
  color: #d30000 !important;
}
.badge-warning {
  background-color: #ffeccc !important;
  color: #ce8500 !important;
}
.nav-tabs .nav-item .nav-link {
  color: #706a94 !important;
  border: 0px solid #ccc !important; 
  border-radius: 0 !important; 
}

.nav-tabs .nav-item .nav-link:not(.active) {
    border-top: none !important;
}

.nav-tabs .nav-item .nav-link:hover, .nav-tabs .nav-item .nav-link:focus {
    background-color: #f4f2ff !important;
}

.nav-tabs .nav-item .nav-link.active {
    color: #2d2943 !important;
    border-bottom: 2px solid #706a94 !important; 
    font-weight: bolder !important;
}

.table-wrap {
  overflow-x: scroll; }
.datatable {
  border-radius: 10px !important;
  border: 2px solid #f4f2ff !important;
}
.datatable .row{
 padding: 20px !important;
}
.table {
  min-width: 1000px !important;
  width: 100%;
  -webkit-transition: 0.3s;
  -o-transition: 0.3s;
  transition: 0.3s;
  -webkit-box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
  -moz-box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
  box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29); 
  
}
  @media (prefers-reduced-motion: reduce) {
    .table {
      -webkit-transition: none;
      -o-transition: none;
      transition: none; } }
  .table thead th {
    border: none;
    /* padding: 30px; */
    font-size: 14px;
    color: #706a94 !important;
    text-transform: capitalize !important;
    font-weight: bolder !important;
    /* border-bottom: 2px solid #ececec; */
    background: #f4f2ff; }
  .table tbody tr {
    margin-bottom: 10px;
    cursor: pointer;
    background: #fff;
    border-bottom: 2px solid #ececec;
    -webkit-transition: 0.3s;
    -o-transition: 0.3s;
    transition: 0.3s; }
    @media (prefers-reduced-motion: reduce) {
      .table tbody tr {
        -webkit-transition: none;
        -o-transition: none;
        transition: none; } }
  .table tbody th, .table tbody td {
    border: none;
    padding: 10px;
    font-size: 14px; }
  .table tbody td.acc {
    background: #f3f3f3;
    border: none; }
  .table tbody td .fa {
    font-size: 12px;
    color: #28a745; }
  .table tbody td:nth-child(4), .table thead th:nth-child(4) {
    /* text-align: right;  */
    max-width: 10% !important;
  }
  .table tbody td:nth-child(4) {
    text-align: right;
  }

  .page-link.active, .active > .page-link {
    border: 0 !important;
    background-color: #706a94 !important;
  }

[data-toggle="collapse"] .fa:before {
  content: "\f062";
  font-family: "FontAwesome";
  font-style: normal;
  -webkit-transition: 0.3s;
  -o-transition: 0.3s;
  transition: 0.3s; }
  @media (prefers-reduced-motion: reduce) {
    [data-toggle="collapse"] .fa:before {
      -webkit-transition: none;
      -o-transition: none;
      transition: none; } }

[data-toggle="collapse"].collapsed .fa:before {
  content: "\f063";
  font-family: "FontAwesome";
  font-style: normal;
  -webkit-transition: 0.3s;
  -o-transition: 0.3s;
  transition: 0.3s; }
  @media (prefers-reduced-motion: reduce) {
    [data-toggle="collapse"].collapsed .fa:before {
      -webkit-transition: none;
      -o-transition: none;
      transition: none; } }

[data-toggle="collapse"] {
  background: #ececec !important; }

[data-toggle="collapse"].collapsed {
  background: #fff !important; }
  [data-toggle="collapse"].collapsed:hover {
    background: #ececec !important;
    border-bottom: 2px solid #ececec; }


.dropdown {
    position: relative;
    display: inline-block;
}

/* Style the dropdown content (hidden by default) */
.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
}

/* Style the links inside the dropdown */
.dropdown-content li {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content li:hover {
    background-color: #3498db;
    color: white;
}

/* Show the dropdown when the button is hovered over */
.dropdown:hover .dropdown-content {
    display: block;
}
</style>