/**
 * 全体接口的路由
 * @type {*|module:koa-router|Router|undefined}
 */
const router = require('koa-router')();
const controller = require('../controller/controller.js');

// 登录接口
router.post('/login', controller.Login);

// 获取部门接口
router.get('/getDepts', controller.getDepts);

// 获取学科接口
router.get('/getSubjects', controller.getSubjects);

// 通过部门分类
router.get('/getContactsByDeptID/:deptID', controller.getContactsByDeptID);

// 通过学科分类
router.get('/getContactsBySubjectID/:subjectID', controller.getContactsBySubjectID);

// 通过搜索分类
router.get('/searchByKeyword/:keyword', controller.searchByKeyword);

// 获取个人信息
router.get('/getContactByID/:userID', controller.getContactByID);

// 更新后获取个人信息
router.get('/getContactWhenUpdate/:userID', controller.getContactWhenUpdate);

// 获取所有信息
router.get('/getAll', controller.getAll);

// 更新个人信息
router.post('/updateContact/:userID', controller.updateContact);

// 添加用户
router.post('/add/:userID', controller.add);

// 删除用户
router.post('/delete/:userID', controller.delete);

module.exports = router;
