<template>
  <div class="pos">
    <el-row>
      <el-col :span="7" class="pos-order" id="orderList">
        <el-tabs>
          <el-tab-pane label="结账">
            <el-table :data="tableData" border style="width:100%;">
              <el-table-column prop="goodsName" label="商品名称"></el-table-column>
              <el-table-column prop="price" label="金额" width="60"></el-table-column>
              <el-table-column prop="count" label="数量" width="60"></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="delsingle(scope.row)">删除</el-button>
                  <el-button type="text" size="small" @click="addorder(scope.row)">增加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="showTotal">
              <span><small>数量：</small>{{totalCount}}</span>
              <span><small>金额：</small>{{totalMoney}}</span>
            </div>
            <el-row class="footer-btn">
              <el-button type="warning">挂单</el-button>
              <el-button type="danger" @click="delAll">删除</el-button>
              <el-button type="success" @click="overPrice">结账</el-button>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="挂单">

          </el-tab-pane>
          <el-tab-pane label="外卖">

          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="17">
        <div class="often-foods">
          <div class="often-foods-title">常用商品</div>
          <div class="often-foods-list">
            <ul>
              <li v-for="item in oftenFoods" @click="addorder(item)">
                <span>{{item.goodsName}}</span>
                <span class="price">¥{{item.price}}元</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="foods-type">
          <el-tabs>
            <el-tab-pane label="汉堡">
              <ul class="foods-type-list">
                <li v-for="item in type0Foods" @click="addorder(item)">
                  <span class="foodImg">
                    <img :src="item.goodsImg" width="100%"/>
                  </span>
                  <span class="foodName">{{item.goodsName}}</span>
                  <span class="foodPrice">¥{{item.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="小食">
              <ul class="foods-type-list">
                <li v-for="item in type1Foods" @click="addorder(item)">
                  <span class="foodImg">
                    <img :src="item.goodsImg" width="100%"/>
                  </span>
                  <span class="foodName">{{item.goodsName}}</span>
                  <span class="foodPrice">¥{{item.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="饮料">
              <ul class="foods-type-list">
                <li v-for="item in type2Foods" @click="addorder(item)">
                  <span class="foodImg">
                    <img :src="item.goodsImg" width="100%"/>
                  </span>
                  <span class="foodName">{{item.goodsName}}</span>
                  <span class="foodPrice">¥{{item.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="套餐">
              <ul class="foods-type-list">
                <li v-for="item in type3Foods" @click="addorder(item)">
                  <span class="foodImg">
                    <img :src="item.goodsImg" width="100%"/>
                  </span>
                  <span class="foodName">{{item.goodsName}}</span>
                  <span class="foodPrice">¥{{item.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'pos',
    data () {
      return {
        totalCount: 0,
        totalMoney: 0,
        tableData: [],
        oftenFoods: [],
        type0Foods: [],
        type1Foods: [],
        type2Foods: [],
        type3Foods: []
      }
    },
    created(){
      axios.get('http://jspang.com/DemoApi/oftenGoods.php')
        .then(res => {
          console.log(res);
          this.oftenFoods = res.data;
        })
        .catch(err => {
          alert("网络错误，请重新加载～");
        }),

        axios.get('http://jspang.com/DemoApi/typeGoods.php')
          .then(res => {
//            console.log(res);
            this.type0Foods = res.data[0];
            this.type1Foods = res.data[1];
            this.type2Foods = res.data[2];
            this.type3Foods = res.data[3];
          })
          .catch(err => {
            alert("网络错误，请重新加载～");
          })

    },
    mounted(){
      let orderH = document.body.clientHeight;;
      document.getElementById('orderList').style.height = orderH + 'px';
    },
    methods:{
      addorder(order){
        this.totalCount = 0;
        this.totalMoney = 0;
        //先判断订单列表有没有此商品
        let isHave = false;//订单有无此商品
          this.tableData.forEach(ele => {
            if (ele.goodsId === order.goodsId) {
              isHave = true;
            }
          });
        //有就数量+1，没有就把商品加入到订单列表
          if (isHave) {
            let arr = this.tableData.filter(o => o.goodsId === order.goodsId);
            arr[0].count++;
          }else {
            let newTableData = {
              goodsId: order.goodsId,
              goodsName: order.goodsName,
              price: order.price,
              count: 1
            }
            this.tableData.push(newTableData);
          }
        this.resetTotal();

      },
      delsingle(single) {//单个删除
        this.tableData = this.tableData.filter(o => o.goodsId !== single.goodsId);
        this.resetTotal();
      },
      delAll() {
        this.totalMoney = 0;
        this.totalCount = 0;
        this.tableData = [];
      },
      overPrice() {
        if (this.totalMoney !== 0) {
          this.totalCount = 0;
          this.tableData = [];
          this.$message.success('恭喜你结账成功，交易金额是：'+this.totalMoney);
          this.totalMoney = 0;
        }else {
          this.$message.error('您还没有选择商品，请勿结账，谢谢～')
        }
      },
      resetTotal(){
        this.totalMoney = 0;
        this.totalCount = 0;
        this.tableData.forEach( ele => {//重新计算数量和金额
          this.totalCount += ele.count;
          this.totalMoney += ele.count * ele.price;
        });
      }
    }
  }
</script>


<style lang="scss" scoped>
  .pos{
    &-order{
      background-color:#f9fafc;
      border-right:1px solid #c0ccda;
      .footer-btn{
        margin-top:20px;
      }
      .showTotal{
        padding:10px;
        border-bottom: 1px solid #fff;
        background-color: #fff;
        span:first-child{
          display: inline-block;
          margin-right: 20px;
        }
      }
    }
    .often-foods{
      &-title{
        height: 20px;
        border-bottom:1px solid #D3DCE6;
        background-color: #F9FAFC;
        padding:10px;
      }
      &-list ul li{
        display:inline-block;
        border:1px solid #E5E9F2;
        padding:10px;
        margin:5px;
        background-color:#fff;
        cursor:pointer;
        .price{
          color:#58B7FF;
        }
      }
    }
    .foods-type{
      margin-top:20px;
      &-list li{
        width:23%;
        border:1px solid #E5E9F2;
        height: auto;
        overflow: hidden;
        background-color:#fff;
        padding: 2px;
        display:inline-block;
        margin: 2px;
        cursor:pointer;
        span{
          display: block;
          /*float:left;*/
          .foodImg{
          width:40%;
          }
          .foodName{
            font-size: 18px;
            padding-left: 10px;
            color:brown;
          }
          .foodPrice{
            font-size: 16px;
            padding-left: 10px;
            padding-top:10px;
          }
        }
      }
    }
  }
</style>

