<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCateDialog()"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表单区域 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted == false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="small" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="small"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="small" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="showCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
         
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCateDialog(scope.row.cat_id)"
            >删除</el-button
          >
           <!-- {{scope.row}} -->
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类 -->
    <el-card>
      <el-dialog
        title="添加分类"
        :visible.sync="cateDialogVisible"
        width="50%"
        @close="cateDialogClose"
      >
        <!-- 添加分类表单 -->
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类:">
            <!-- //级联选择器hover options用来指定数据源-->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              expand-trigger="hover"
              :props="cascaderProps"
              @change="parentCateChanged"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>

    <el-dialog
      title="分类编辑"
      :visible.sync="showdialogVisible"
      width="50%"
      @close="showdialogVisibleclose"
    >
      <el-form
        :model="aaddCateForm"
        :rules="aaddCateFormRules"
        ref="aaddCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="aaddCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getCateList();
  },
  props: {},
  data() {
    return {
      //查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类的数据列表,默认为空
      cateList: [],
      //总数据条数 默认是0
      total: 0,
      //为table 指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //将当前列定义为自定义模板列
          type: "template",
          //并表示当前这一列使用的模板名称
          template: "isok",
        },
        {
          label: "排序",
          //将当前列定义为自定义模板列
          type: "template",
          //并表示当前这一列使用的模板名称
          template: "order",
        },
        {
          label: "操作",
          //将当前列定义为自定义模板列
          type: "template",
          //并表示当前这一列使用的模板名称
          template: "opt",
        },
      ],
      //控制添加分类对话框的显示与隐藏
      cateDialogVisible: false,
      //添加分类表单的数据对象
      addCateForm: {
        //将要添加的分类名称
        cat_name: "",
        //父级分类id
        cat_pid: 0,
        //将要添加分类的层级 0 代表默认是一级分类
        cat_level: 0,
      },
      aaddCateForm: {
        //将要添加的分类名称
        cat_name: "",
        //父级分类id
        cat_pid: 0,
        //将要添加分类的层级 0 代表默认是一级分类
        cat_level: 0,
      },
      //添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      aaddCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //父级分类的列表
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //选中的父级分类id的数组
      selectedKeys: [],
      showdialogVisible: false,
    };
  },
  methods: {
    //获取商品数据分类
    getCateList() {
      this.axios
        .get("categories", {
          params: this.querInfo,
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.error("请求数据失败!");
          } else {
            //把数据列表赋值给catelist
            this.cateList = res.data.data.result;
            //把total总数据条数赋值
            this.total = res.data.data.total;
          }
        });
    },
    //监听pagesize 改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听 pagenum 改变
    handleCurrentChange(newPagenum) {
      this.querInfo.pagenum = newPagenum;
      this.getCateList();
    },
    //点击按钮展示添加分类的对话框
    showCateDialog() {
      //先获取父级分类的数据列表
      this.getParentCateList();
      //在展示出对话框
      this.cateDialogVisible = true;
    },
    //获取父级分类的数据列表
    getParentCateList() {
      this.axios
        .get("categories", {
          params: {
            type: 2,
          },
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.error("获取父级分类的数据列表失败!");
          } else {
            this.parentCateList = res.data.data;
          }
        });
    },
    //选择项发生变化出发这个函数
    parentCateChanged() {
      console.log(this.selectedKeys);
      //如果selectedKeys数组中的length大于0 证明选中的父级分类
      //反之就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    cateDialogClose() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.getCateList();
        this.cateDialogVisible = false;
      });
    },
    async showCateDialog(id) {
      const { data: res } = await this.$http.get("categories/" + id);
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("查询失败");
      }
      //   console.log(res);
      this.aaddCateForm = res.data;

      this.showdialogVisible = true;
    },
    showdialogVisibleclose() {
      this.$refs.aaddCateFormRef.resetFields();
    },
    addCateDialog() {
      this.$refs.aaddCateFormRef.validate(async (valid) => {
        if (!valid) return;
        // console.log(valid);
        const { data: res } = await this.$http.put(
          "categories/" + this.aaddCateForm.cat_id,
          {
            cat_name: this.aaddCateForm.cat_name,
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("更新失败");
        }
        this.$message.success("更新成功");
        this.showdialogVisible = false;
        this.getCateList();
      });
    },

    deleteCateDialog(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
             this.$http.delete("categories/" + id).then((res) => {
            console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error("删除失败");
            } else {
              this.$message.success("删除成功");
              this.getCateList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.treeTable {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
