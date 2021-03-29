
<template>
  <ul class="pagination">
    <li class="pagination-item" :class="{'disabled': current == 1}" @click="setCurrent(current - 1)">
      <a class="a-link" :href="baseUrl + 'sitemap/searches/' + (current - 1)" @click.prevent="()=> false">&lt;&lt;</a>
    </li>
    <li v-for="(p, index) in grouplist" :key="index" class="pagination-item" :class="{'active': current == p.val}" @click="setCurrent(p.val)">
      <a class="a-link" :href="baseUrl + 'sitemap/searches/' + p.val" @click.prevent="()=>false"> {{ p.text }} </a>
    </li>
    <li class="pagination-item" :class="{'disabled': current == page}" @click="setCurrent(current + 1)">
      <a class="a-link" :href="baseUrl + 'sitemap/searches/' + (current + 1)" @click.prevent="()=>false">&gt;&gt;</a>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    total: { // 数据总条数
      type: Number,
      default: 0
    },
    display: { // 每页显示条数
      type: Number,
      default: 200
    },
    currentPage: { // 当前页码
      type: Number,
      default: 1
    },
    pagegroup: { // 分页条数
      type: Number,
      default: 5,
      coerce (v) {
        v = v > 0 ? v : 5
        return v % 2 === 1 ? v : v + 1
      }
    }
  },
  data () {
    return {
      current: this.currentPage
    }
  },
  computed: {
    baseUrl () {
      return process.env.proxyUrl
    },
    page () { // 总页数
      return Math.ceil(this.total / this.display)
    },
    grouplist () { // 获取分页页码
      let len = this.page; let temp = []; const list = []; const count = Math.floor(this.pagegroup / 2); let center = this.current
      if (len <= this.pagegroup) {
        while (len--) {
          temp.push({ text: this.page - len, val: this.page - len })
        }
        ;
        return temp
      }
      while (len--) {
        temp.push(this.page - len)
      }
      ;
      const idx = temp.indexOf(center);
      (idx < count) && (center = center + count - idx);
      (this.current > this.page - count) && (center = this.page - count)
      temp = temp.splice(center - count - 1, this.pagegroup)
      do {
        const t = temp.shift()
        list.push({
          text: t,
          val: t
        })
      } while (temp.length)
      if (this.page > this.pagegroup) {
        (this.current > count + 1) && list.unshift({ text: '...', val: list[0].val - 1 });
        (this.current < this.page - count) && list.push({ text: '...', val: list[list.length - 1].val + 1 })
      }
      return list
    }
  },
  methods: {
    setCurrent (idx) {
      if (this.current !== idx && idx > 0 && idx < this.page + 1) {
        this.current = idx
        this.$emit('pageChange', this.current)
      }
    }
  }
}

</script>

<style lang="less" scoped>
  .pagination {
    overflow: hidden;
    display: table;
    margin: 0 auto;
    height: 80px;
  .pagination-item {
      float: left;
      height: 60px;
      border-radius: 5px;
      margin: 3px;
      border: 1px solid #dcdee2;
      color: #515a6e;
      background: #fff;
    &:hover {
      background: #fff;
      border: 1px solid #2d8cf0;
      .a-link{
        color: #2d8cf0;
      }
    }
    .a-link{
      display: block;
      width: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      font-size: 28px;
      border-radius: 5px;
      text-decoration: none;
      color: #515a6e;
    }

  }
    .active {
      background: #fff;
      border: 1px solid #2d8cf0;
      .a-link{
        color: #2d8cf0;
      }
    }
  }

</style>
