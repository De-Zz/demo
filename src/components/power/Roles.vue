<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="roleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbuttom', i1 === 0 ? 'bdtop' : '', 'ven', 'lr']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'ven']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <!-- :enterable是是否可以在提示上边显示 -->
              <el-button
                size="small"
                type="primary"
                icon="el-icon-edit"
                @click="showDialogVisible(scope.row.id)"
                >编辑</el-button
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                @click="deleteDialogVisible(scope.row.id)"
                >删除</el-button
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
            >
              <el-button
                size="small"
                type="warning"
                icon="el-icon-setting"
                @click="showSetRightDialog(scope.row)"
            
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色区域 -->
    <el-dialog
      title="添加角色"
      :visible.sync="roleDialogVisible"
      width="50%"
      @close="roleDialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="roleForm"
        :rules="roleFormRules"
        ref="roleFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="角色编辑"
      :visible.sync="ruleDialogVisible"
      width="50%"
      @close="ruleDialogClose"
    >
      <el-form
        :model="ruleFormRule"
        :rules="ruleFormRuleRules"
        ref="ruleFormRuleRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="ruleFormRule.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="ruleFormRule.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="ruleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rulesDialogVisible">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
          @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getRoleList();
  },
  data() {
    return {
      //所有角色列表数据
      roleList: [],

      roleDialogVisible: false,
      //添加角色的表单数据
      roleForm: {
        roleName: "",
        roleDesc: "",
      },
      //添加验证规则
      roleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      ruleDialogVisible: false,
      ruleFormRule: {},
      ruleFormRuleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      cnmid: "",
      //控制分配权限的对话框的显示与隐藏
      setRightDialogVisible: false,
      rightsList: [],
      //树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      //默认选中的节点id值数组
      defKeys: [],
      //当前即将分配权限的角色id
      roleId:''
    };
  },
  methods: {
    //获取所有角色列表
    getRoleList() {
      this.axios.get("roles").then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取角色列表失败");
        } else {
          this.roleList = res.data.data;
        }
      });
    },
    roleDialogClose() {
      this.$refs.roleFormRef.resetFields();
    },
    roleUser() {
      //表单预校验
      this.$refs.roleFormRef.validate((valid) => {
        //   console.log(valid);
        if (!valid) return;

        //添加用户的网络请求
        this.axios.post("roles", this.roleForm).then((res) => {
          if (res.data.meta.status !== 201) {
            this.$message.error("请求失败");
          } else {
            this.$message.success("添加角色成功");
            //隐藏添加角色框
            this.roleDialogVisible = false;
            this.getRoleList();
          }
        });
      });
    },

    //编辑项
    async showDialogVisible(id) {
      // console.log(id);
      const { data: res } = await this.$http.get("roles/" + id);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户失败");
      }
      this.ruleFormRule = res.data;
      this.ruleDialogVisible = true;
      // console.log(id);
      this.cnmid = id;
    },
    ruleDialogClose() {
      this.$refs.ruleFormRuleRef.resetFields();
    },
    rulesDialogVisible() {
      this.$refs.ruleFormRuleRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.put("roles/" + this.cnmid, {
          roleName: this.ruleFormRule.roleName,
          roleDesc: this.ruleFormRule.roleDesc,
        });
        if (res.meta.status !== 200) {
          return this.$message.error("更新失败");
        }
        this.ruleDialogVisible = false;
        this.getRoleList();
        this.$message.success("更新成功");
      });
    },

    //删除项
    deleteDialogVisible(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.delete(`roles/${id}`).then((res) => {
            console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error("角色删除失败");
            } else {
              this.$message.success("删除成功");
              this.getRoleList();
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
    //根据id删除对应的权限
    removeRightById(role, rightId) {
      //弹框提示用户是否要删除
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios
            .delete(`roles/${role.id}/rights/${rightId}`)
            .then((res) => {
              if (res.data.meta.status !== 200) {
                return this.$message.error("删除失败");
              } else {
                role.children = res.data.data;
                this.$message.success("删除成功");
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
    //展示分配权限的对话框
    showSetRightDialog(role) {
      this.roleId = role.id
      //获取所有权限的数据
      this.axios.get("rights/tree").then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取权限数据失败");
        } else {
          //获取到的数据权限保存在data中
          this.rightsList = res.data.data;
          console.log(this.rightsList);
        }
      });
      //递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys);

      this.setRightDialogVisible = true;
    },
    //通过递归的形式 获取角色下所有三级权限的id 并保存到  defKeys 数组中
    getLeafKeys(node, arr) {
      //如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    allotRights(){
      const keys = [
        ...this.$refs.treeRef.
        getCheckedKeys(),
        ...this.$refs.treeRef.
        getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')
      this.axios.post(`roles/${this.roleId}/rights`,{rids:idStr}).then((res)=>{
        if(res.data.meta.status !== 200){
          return this.$message.error('分配权限失败')
        }else{
          this.$message.success('分配权限成功')
          this.getRoleList()
          this.setRightDialogVisible=false
        }

        
      })
      // console.log(keys);
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbuttom {
  border-bottom: 1px solid #eee;
}
.ven {
  display: flex;
  align-items: center;
}
.lr {
  margin: 0 40px;
}
</style>
