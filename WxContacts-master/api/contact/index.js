const router = require('koa-router')();
const controller = require('./controller.js');

router.post('/login', controller.Login);
router.get('/getDepts', controller.getDepts);
router.get('/getSubjects', controller.getSubjects);
router.get('/getContactsByDeptID/:deptID', controller.getContactsByDeptID);
router.get('/getContactsBySubjectID/:subjectID', controller.getContactsBySubjectID);
router.get('/searchByKeyword/:keyword', controller.searchByKeyword);
router.get('/getContactByID/:userID', controller.getContactByID);
router.get('/getContactWhenUpdate/:userID', controller.getContactWhenUpdate);
router.get('/getAll', controller.getAll);
router.post('/updateContact/:userID', controller.updateContact);
router.post('/add/:userID', controller.add);
router.post('/delete/:userID', controller.delete);

module.exports = router;