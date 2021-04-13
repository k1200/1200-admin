# Space PC 端组件文档
## 安装|使用
### 依赖安装
```
npm i <name> --save --registry=http://172.16.163.24:8081/repository/npm-public/
```
### 使用指南
+ 全局注册组件
  ```js
  // @/main.js
  import Vue from 'vue';
  import CreateApp from '@/plugins';
  // 引入完整表格页面，含搜索栏，分页栏
  import SpaceTablePage from 'space-table-page';
  // 只引入表格组件
  // import {SpaceTable} from 'space-table-page';
  CreateApp(Vue, () => {
    // 其他全局代码执行逻辑  do list
    Vue.use(SpaceTablePage)
    // Vue.use(SpaceTable)
  });
  ```
  + 组件内使用
  ```vue
  <template>
    <space-table-page
      :columns="columns"
      :action="getList"
      :table-data="tableData"
      :search-props="searchProps"
      :page-props="pageProps"
      :selected="selected"
      :selectable="setSelectable"
      :reserve-selection="reserveSelection"
      :size="size"
      :reset="reset"
      :filter-method="filterMethod"
      :sort-method="sortMethod"
    >
      <!-- 搜索栏 -->
      <!-- <template #search></template> -->
      <!-- 完全自定义列 靠前 -->
      <!-- <template #columnBefore></template> -->
      <!-- 完全自定义列 靠后 -->
      <!-- <template #columnAfter></template> -->

      <!-- 完全自定义表头，列，表头筛选 -->
      <!-- <template #propHeader="{column}"></template>
      <template #prop="{row, $index, column}"></template>
      <template #propFilter="{column}"></template> -->

      <!-- 表格多选 -->
      <!-- <template #multiple></template> -->
    </space-table-page>
  </template>
  <script>
    // 如果全局已注册 无需再次引入
    import SpaceTablePage from 'space-table-page';
    export default {
      // 如果全局已注册 无需再次注册
      components: {
        SpaceTablePage
      },
      data() {
        return {
          // 查询参数
          searchForm: {},
          /** 组件属性配置项 组件属性配置项 组件属性配置项 **/
          tableData: [], // 表格数据
          // 表格属性配置 参考element-ui
          tableProps: {
            attrs: {}, // 属性
            listeners: {} // 事件 会严格区分驼峰和短横线
          },
          // 搜索栏配置
          searchProps: {
            resetBtn: true, // 是否显示重置按钮
            resetText: '重置', // 重置按钮文本
            queryBtn: true, // 是否显示搜索按钮
            queryText: '查询', // 搜索按钮文本
            addBtn: true, // 是否显示新增按钮
            addText: '新增', // 新增按钮文本
            filterBtn: true, // 是否显示 控制列显示 按钮
            handleReset: this.handleReset, // 搜索重置回调函数
            handleAdd: this.handleAdd, // 点击新增按钮回调函数
            handleQuery: this.handleQuery // 触发搜索回调函数
          },

          // 分页参数
          pageProps: {
            pageSize: 10,
            currentPage: 1,
            total: 0,
            totalPage: 0
          },

          // 表格多选配置
          selected: [], // 已选择数据|开启多选
          reserveSelection: false, // 是否在数据更新之后保留之前选中的数据

          tableIndex: true, // 是否开启列的序号
          indexLable: '序号', // 列序号的表头文本

          size: 'small', // 表格尺寸
          reset: false, // 重置表格查询条件
          /** 组件属性配置项 组件属性配置项 组件属性配置项 **/
        }
      },
      computed: {
        columns() {
          return [
            {
              prop: 'projectName',
              label: '项目名称',
              invisible: false,
              hidden: this.isHidden,
              filtertable: true,
              slot: true,
              headerSlot: false,
              filterSlot: false,
              dictProps: {
                label: 'projectName',
                value: 'id'
              },
              dict: this.projectList,
              attrs: { // element-ui 属性集合
                minWidth: 163,
                fixed: 'left'
              }
            },
            {
              prop: 'endTime',
              label: '装修完成时间',
              sortable: true,
              sortProps: {
                descending: 2,
                ascending: 1,
                prop: 'tag'
              },
              filtertable: true,
              formatter(row, column, $index) {
                // console.log(row, column, $index)
                return new Date(row[column.prop])
              },
              filterProps: {
                type: 'daterange',
                rangeSeparator: '至',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期',
                valueFormat: 'yyyy-MM-dd',
                formatter(value) {
                  return {
                    startTime: value[0],
                    endTime: value[1]
                  }
                }
              },
              attrs: {
                minWidth: 152,
                sortable: true
              }
            },
            {
              prop: 'area',
              label: '面积(㎡)',
              attrs: { minWidth: 89 }
            },
            {
              prop: 'decorateCharge',
              label: '费用(元)',
              attrs: {
                minWidth: 97
              }
            },
            {
              prop: 'status',
              label: '状态',
              type: 'enum',
              filtertable: true,
              dict: [
                {
                  label: '草稿',
                  value: 1
                },
                {
                  label: '已完成',
                  value: 0
                }
              ],
              attrs: {
                minWidth: 91
              }
            }

          ]
        }
      },
      methods: {
        // 获取数据(返回一个异步函数)
        getList() {
          const data = this.formatterReqdata()
          const params = {
            pageSize: this.pageProps.pageSize,
            pageNo: this.pageProps.currentPage
          }
          return apiGetTable(data, params).then(res => {
            this.formatterResdata(res)
          }).catch(() => {
            this.tableData = []
          })
        },
        // 格式化响应数据
        formatterResdata(res) {
          this.pageProps.total = res.data.total
          this.tableData = res.data.records
        },
        // 格式化请求参数
        formatterReqdata() {
          const data = this.searchForm
          return data
        },
        // 搜索
        handleQuery() {
          console.log('handleQuery')
          this.pageProps.currentPage = 1
          this.getList()
        },
        // 新增函数
        handleAdd() {
          console.log('handleAdd')
        },
        // 控制当前列是否可选（返回true可选）
        setSelectable(row, index) {
          return index !== 4
        },

        // 重置搜索条件
        handleReset() {
          console.log('handleReset')
          this.searchForm = {}
          this.pageProps.currentPage = 1
          this.reset = !this.reset
          this.getList()
        },

        // 数据筛选
        filterMethod(val) {
          console.log(`filterMethod:${JSON.stringify(val)}`)
        },
        // 数据排序
        sortMethod(val) {
          console.log(`sortMethod:${JSON.stringify(val)}`)
        },
      }
    };

  ```
## Space-tabel-page 表格页组件（含搜索栏，表格栏，分页及多选操作栏）

### Space-tabel-page Attributes

| 参数             | 说明                                                                                                                         | 类型                 | 可选值                | 默认值 |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------------------- | ------ |
| columns          | 表格列配置，在页面中属于计算属性，<a href="#columns">参考下表</a>                                                                                                         | object               | —                     | —      |
| table-data        | 显示的数据                                                                                                                   | array                | —                     | —      |
| table-props       | 表格原生属性事件配置，<a href="#tableProps">参考下表</a>                                                                                               | object               | —                     | —      |
| search-props     | 搜索栏配置，<a href="#searchProps">参考下表</a>                                                                                                         | Object               | —                     | —      |
| page-props       | 分页栏配置，<a href="#pageProps">参考下表</a>                                                                                                         | Object               | —                     | —      |
| reserveSelection | 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key,默认 row-key=id） | boolean              | —                     | false  |
| selectable       | 仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选                       | Function(row, index) | —                     | —      |
| selected         | 多选选中的数据                                                                                                               | array                | —                     | —      |
| tableIndex       | 是否开启列的序号                                                                                                             | boolean              | —                     | true   |
| indexLable       | 列序号的表头文本                                                                                                             | string               | —                     | 序号   |
| size             | 表格尺寸                                                                                                                     | string               | small / mini | small  |
| action    | 获取表格数据的方法（异步函数）      | Function  |   —    | — |

### Space-tabel-page Slot

| name                   | 说明               |
| ---------------------- | ------------------ |
| search                 | 自定义搜索条件     |
| searchBtns             | 自定义搜索栏按钮   |
| columnBefore           | 完全自定义列(靠前) |
| columnAfter            | 完全自定义列(靠后) |
| [column.prop]          | 自定义列           |
| [column.prop+'Header'] | 自定义表头         |
| multiple               | 多选栏按钮组       |
| page                   | 自定义分页栏       |
### Space-table-page Methonds
|方法名|说明|参数|
| --- | ---- | -- |
| handle-reset | 重置表格查询条件 | — |
### Space-table-page Events
|事件名称|说明|回调参数|
| --- | ---- | -- |
| filter-method    | 表头筛选方法，表头筛选时会触发。 | { prop} |
| sort-method      | 表头排序方法，表头排序时会触发。 | { prop, order } |
| selection-change | 当选择项发生变化时会触发该事件   | selection       |
### <a id="columns">Attributes columns</a>

| 参数        | 说明                                                     | 类型                                                                                   | 可选值                                                                                                                                                                           | 默认值        |
| ----------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| prop        | 对应列内容的字段名                                       | string                                                                                 | —                                                                                                                                                                                | —             |
| label       | 显示的标题                                               | string                                                                                 | —                                                                                                                                                                                | —             |
| invisible     | 是否隐藏列(列表隐藏，筛选控件不选中)                     | boolean                                                                                | —                                                                                                                                                                                | false         |
| hidden      | 是否删除列((列表隐藏，筛选控件都隐藏))                   | boolean                                                                                | —                                                                                                                                                                                | false         |
| type        | 列的数据类型-持续补充                                    | string                                                                                 | enum,预计扩展[date,datetime,time,switch]                                                                                                                                         | —             |
| slot        | 是否开启列的插槽(只用表格组件，可不设置该参数默认开启插槽)                                         | boolean                                                                                | —                                                                                                                                                                                | false         |
| headerSlot  | 是否开启当前列表头的插槽 (只用表格组件，可不设置该参数默认开启插槽)                            | boolean                                                                                | —                                                                                                                                                                                | false         |
| filtertable | 是否开启表头筛选, 枚举类型需配置 dict                    | boolean                                                                                | —                                                                                                                                                                                | false         |
| filterProps | 表头过滤配置项，需要开启表头过滤(filtertable=true)       | {type, formatter(数据格式化): Function(value)/any }}                                   | select/date/datetime；其他 type 类型后期逐步迭代。对象必须含 type 属性，其他属性根据类型不同，参考[element-ui](https://element.eleme.cn/#/zh-CN/component/installation) 原生属性 | {type:select} |
| sortable    | 是否开启表头排序                                         | boolean                                                                                | —                                                                                                                                                                                | false         |
| sortProps   | 排序属性配置，需要开启表头排序(sortable=true)            | object                                                                                 | {ascending(升序): 2, descending(降序): 1, formatter(数据格式化): Function(value)/Object }                                                                                        | false         |
| dict        | 数据过滤(type=enum)的选项，数组格式                      | Array[{ label, value }]                                                                | —                                                                                                                                                                                | —             |
| dictProps   | 数据过滤的配置项                                         | Object{ label, value, prop }; dictProps.prop 属性自定义筛选字段，默认会取 options.prop | —                                                                                                                                                                                | —             |
| formatter   | 用来格式化内容                                           | Function(row, column, \$index)                                                         | —                                                                                                                                                                                | —             |
| attrs       | 其他未涉及的 element-ui 原生属性集合                     | object                                                                                 | —                                                                                                                                                                                | —             |

### <a id="tableProps">Attributes tableProps</a>

| 参数      | 说明                                                                                       | 类型   | 可选值 | 默认值 |
| --------- | ------------------------------------------------------------------------------------------ | ------ | ------ | ------ |
| attrs     | [element-ui](https://element.eleme.cn/#/zh-CN/component/table) 表格原生属性                | Object | —      | —      |
| listeners | [element-ui](https://element.eleme.cn/#/zh-CN/component/table)表格原生事件，属性名为小驼峰 | Object | —      | —      |

### <a id="searchProps">Attributes searchProps</a>

| 参数        | 说明               | 类型     | 可选值 | 默认值 |
| ----------- | ------------------ | -------- | ------ | ------ |
| resetBtn    | 是否显示重置按钮   | boolean  | —      | true   |
| resetText   | 重置按钮文本       | string   | —      | 重置   |
| queryBtn    | 是否显示查询按钮   | boolean  | —      | true   |
| queryText   | 查询按钮文本       | string   | —      | 查询   |
| addBtn      | 是否显示新增按钮   | boolean  | —      | true   |
| addText     | 新增按钮文本       | string   | —      | 新增   |
| filterBtn   | 是否显示列显隐按钮 | boolean  | —      | true   |
| handleQuery | 查询方法           | Function | —      | —      |
| handleReset | 重置方法           | Function | —      | —      |
| handleAdd   | 新增方法           | Function | —      | —      |

### <a id="pageProps">Attributes pageProps</a>

tip: [element-ui](https://element.eleme.cn/#/zh-CN/component/pagination)分页原生属性，属性名为小驼峰

## Space-table 表格组件（只含表格, 该情况下支持Element-ui的所有属性，事件）

### Space-table Attributes

| 参数             | 说明                                                                                                                         | 类型                 | 可选值                | 默认值 |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------------------- | ------ |
| options          | 表格原生属性事件/配置，<a href="#tableProps">参考上表</a>                                                                                                                            | object               | —                     | —      |
| columns          | 表格列配置，在页面中属于计算属性，<a href="#columns">参考上表</a>                                                                                                 | object               | —                     | —      |
| tableData        | 显示的数据                                                                                                                   | array                | —                     | —      |
| reserveSelection | 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key,默认 row-key=id） | boolean              | —                     | false  |
| selectable       | 仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选                       | Function(row, index) | —                     | —      |
| selected         | 多选选中的数据                                                                                                               | array                | —                     | —      |
| tableIndex       | 是否开启列的序号                                                                                                             | boolean              | —                     | true   |
| indexLable       | 列序号的表头文本                                                                                                             | string               | —                     | 序号   |
| size             | 表格尺寸                                                                                                                     | string               | small/mini | small  |

### Space-table Methonds

| 方法名           | 说明                             | 参数            |
| ---------------- | -------------------------------- | --------------- |
| handle-reset | 重置表格查询条件 | — |
### Space-table Events
| 事件名称 | 说明 | 回调参数 |
| --- | ---- | -- |
| filter-method    | 表头筛选方法，表头筛选时会触发。 | { prop} |
| sort-method      | 表头排序方法，表头排序时会触发。 | { prop, order } |
| selection-change | 当选择项发生变化时会触发该事件   | selection       |

## SuffixInput 搜索框
### SuffixInput Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | ---- | -- | -- | -- |
| value/v-model | 绑定值 | string/number | — | — |
| width | 输入框宽度 | string | — | 200px |
| icon | 右侧图标类名 | string | — | el-icon-search |
### SuffixInput Events
| 事件名称 | 说明 | 回调参数 |
| --- | ---- | -- |
| change | 用户按下回车时触发或点击右侧按钮时触发 | -- |
