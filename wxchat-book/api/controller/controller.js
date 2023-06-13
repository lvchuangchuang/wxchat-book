/*
 * 登录
 */
exports.Login = async (ctx) => {
    const { phone, password } = ctx.request.body;

    if (!phone || !password) {
        return ctx.body = {
            success: false,
            message: '手机号码或密码不能为空'
        };
    }

    try {
        let result = await ctx.execSql(
            `SELECT *
             FROM contact_user
             WHERE phone = ? AND password = ?`,
            [phone, password]
        );

        if (result.length > 0) {
            return ctx.body = {
                success: true,
                userID: result[0].id,
                message: ''
            };
        }

        return ctx.body = {
            success: false,
            userID: 0,
            message: '账号或密码错误'
        };
    } catch (error) {
        console.error(error);
        return ctx.body = {
            success: false,
            userID: 0,
            message: '服务器出错'
        };
    }
}


/*
 * 获取部门列表
 */
exports.getDepts = async (ctx) => {
    const sqlQuery = `SELECT a.id, a.name, COUNT(b.deptId) AS count
                      FROM contact_dept AS a
                      INNER JOIN contact_user AS b ON a.id = b.deptId
                      GROUP BY a.id`;

    try {
        const result = await ctx.execSql(sqlQuery);

        return ctx.body = {
            success: true,
            data: result,
            message: '',
        };
    } catch (error) {
        console.error(error);

        return ctx.body = {
            success: false,
            data: [],
            message: '服务器出错',
        };
    }
};


/*
 * 获取学科列表
 */
exports.getSubjects = async (ctx) => {
    const sqlQuery = `SELECT a.id, a.name, COUNT(b.subjectId) AS count
                      FROM contact_subject AS a
                      INNER JOIN contact_user AS b ON a.id = b.subjectId
                      GROUP BY a.id`;

    try {
        const result = await ctx.execSql(sqlQuery);

        return ctx.body = {
            success: true,
            data: result,
            message: '',
        };
    } catch (error) {
        console.error(error);

        return ctx.body = {
            success: false,
            data: [],
            message: '服务器出错',
        };
    }
};

/*
 * 根据部门获取联系人列表
 */
exports.getContactsByDeptID = async (ctx) => {
    const deptID = parseInt(ctx.params.deptID || 0);
    const page = parseInt(ctx.request.query.page || 1);
    const pageNum = parseInt(ctx.request.query.pageNum || 20);
    const pageIndex = (page - 1) * pageNum;

    const sqlQuery = `SELECT a.id, a.name, a.gender, a.phone, a.avatar, b.name AS deptName, b.tel AS deptTel
                      FROM contact_user AS a
                      LEFT JOIN contact_dept AS b ON a.deptId = b.id
                      WHERE a.deptId = ?
                      LIMIT ?, ?`;

    try {
        const result = await ctx.execSql(sqlQuery, [deptID, pageIndex, pageNum]);

        return ctx.body = {
            success: true,
            data: result,
            message: '',
        };
    } catch (error) {
        console.error(error);

        return ctx.body = {
            success: false,
            data: [],
            message: '服务器出错',
        };
    }
};


/*
 * 根据学科获取联系人列表
 */
exports.getContactsBySubjectID = async (ctx) => {
    let subjectID = ctx.params.subjectID ? parseInt(ctx.params.subjectID) : 0,
        page = ctx.request.query.page ? parseInt(ctx.request.query.page) : 1,
        pageNum = ctx.request.query.pageNum || 20,
        pageIndex = (page - 1) * pageNum;

    let sql = ` select a.id, a.name, a.gender, a.phone, a.avatar, b.name as subject
                from contact_user a
                         left join contact_subject b on a.subjectId = b.id
                where a.subjectId = ? limit ?, ?`;
    try {
        let result = await ctx.execSql(sql, [subjectID, pageIndex, pageNum]);
        ctx.body = {
            success: true,
            data: result,
            message: ''
        };
    } catch (err) {
        ctx.body = {
            success: false,
            data: [],
            message: err
        };
    }
}

/*
 * 根据关键字搜索
 */
exports.searchByKeyword = async (ctx) => {
    let keyword = ctx.params.keyword || '',
        page = ctx.request.query.page ? parseInt(ctx.request.query.page) : 1,
        pageNum = ctx.request.query.pageNum || 20,
        pageIndex = (page - 1) * pageNum,
        sql = ` select a.name, a.gender, a.phone, a.avatar, b.name as deptName, b.tel as deptTel, c.name as subject
                from contact_user a
                         left join contact_dept b on a.deptId = b.id
                         left join contact_subject c
                                   on a.subjectId = c.id
                where a.name like '%${keyword}%'
                   or a.phone like '%${keyword}%'
                   or b.name like '%${keyword}%'
                   or b.tel like '%${keyword}%'
                   or c.name like '%${keyword}%' limit ?, ?`;
    try {
        console.log('sql', sql);
        let result = await ctx.execSql(sql, [pageIndex, pageNum]);
        ctx.body = {
            success: true,
            data: result,
            message: ''
        };
    } catch (err) {
        ctx.body = {
            success: false,
            data: [],
            message: err
        };
    }
}

/*
 * 获取我的信息
 */
exports.getContactByID = async (ctx) => {
    let userID = ctx.params.userID || 0;
    let sql = ` select a.name, a.gender, a.phone, a.avatar, b.name as deptName, b.tel as deptTel, c.name as subject
                from contact_user a
                         left join contact_dept b on a.deptId = b.id
                         left join contact_subject c on a.subjectId = c.id
                where a.id = ?`;
    try {
        let result = await ctx.execSql(sql, userID);
        if (result.length > 0) {
            ctx.body = {
                success: true,
                data: result[0],
                message: ''
            };
        } else {
            ctx.body = {
                success: true,
                data: null,
                message: ''
            };
        }
    } catch (err) {
        ctx.body = {
            success: false,
            data: null,
            message: err
        };
    }
}

/*
 * 获取所有信息
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getAll = async (ctx) => {
    let userID = ctx.params.userID || 0;
    let sql = ` select a.name,
                       a.gender,
                       a.phone,
                       b.id   as deptId,
                       b.name as deptName,
                       b.tel  as deptTel,
                       c.id   as subjectId,
                       c.name as subject
                from contact_user a
                         left join contact_dept b on a.deptId = b.id
                         left join contact_subject c on a.subjectId = c.id
                where a.id = ?`;
    try {
        let result = await ctx.execSql(sql, userID);
        let deptResult = await ctx.execSql('select id, name from contact_dept');
        let subjectResult = await ctx.execSql('select id, name from contact_subject');
        if (result.length > 0) {
            ctx.body = {
                success: true,
                data: result[0],
                depts: deptResult || [],
                subjects: subjectResult || [],
                message: ''
            };
        } else {
            ctx.body = {
                success: true,
                data: null,
                depts: [],
                subjects: [],
                message: ''
            };
        }
    } catch (err) {
        ctx.body = {
            success: false,
            data: null,
            depts: [],
            subjects: [],
            message: err
        };
    }
}

/*
 * 编辑我的信息
 */
exports.getContactWhenUpdate = async (ctx) => {
    let userID = ctx.params.userID || 0;
    let sql = ` select a.name,
                       a.gender,
                       a.phone,
                       a.avatar,
                       b.id   as deptId,
                       b.name as deptName,
                       b.tel  as deptTel,
                       c.id   as subjectId,
                       c.name as subject
                from contact_user a
                         left join contact_dept b on a.deptId = b.id
                         left join contact_subject c on a.subjectId = c.id
                where a.id = ?`;
    try {
        let result = await ctx.execSql(sql, userID);
        let deptResult = await ctx.execSql('select id, name from contact_dept');
        let subjectResult = await ctx.execSql('select id, name from contact_subject');
        if (result.length > 0) {
            ctx.body = {
                success: true,
                data: result[0],
                depts: deptResult || [],
                subjects: subjectResult || [],
                message: ''
            };
        } else {
            ctx.body = {
                success: true,
                data: null,
                depts: [],
                subjects: [],
                message: ''
            };
        }
    } catch (err) {
        ctx.body = {
            success: false,
            data: null,
            depts: [],
            subjects: [],
            message: err
        };
    }
}


/*
 * 删除我的信息
 */
exports.delete = async (ctx) => {
    let userID = ctx.params.userID || 0,
        data = {
            userID: ctx.request.body.userID
        };
    try {
        await ctx.execSql('DELETE FROM contact_user WHERE id = ?', data.userID)
        console.log("删除成功")
        ctx.body = {
            success: true,
            message: ''
        };
    } catch (err) {
        console.log(err)
        ctx.body = {
            success: false,
            message: err
        };
    }
}

/*
 * 更新我的信息
 */
exports.updateContact = async (ctx) => {
    let userID = ctx.params.userID || 0,
        data = {
            avatar: ctx.request.body.avatar,
            name: ctx.request.body.name,
            gender: ctx.request.body.gender || 1,
            phone: ctx.request.body.phone,
            deptID: ctx.request.body.deptID || 0,
            subjectID: ctx.request.body.subjectID || 0
        };
    try {
        let result = await ctx.execSql('update contact_user set ? where id = ?', [data, userID]);
        ctx.body = {
            success: true,
            message: ''
        };
    } catch (err) {
        ctx.body = {
            success: false,
            message: err
        };
    }
}

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
exports.add = async (ctx) => {
    let userID = ctx.params.userID || 0, // 这个为空
        data = {
            avatar: ctx.request.body.avatar,
            name: ctx.request.body.name,
            gender: ctx.request.body.gender || 1,
            phone: ctx.request.body.phone,
            deptID: ctx.request.body.deptID || 0,
            subjectID: ctx.request.body.subjectID || 0
        };
    try {
        let id = getRandomNum(10000, 5000000, 1);
        console.log("id" + id)


        // await ctx.execSql("insert into contact_user (id) values (?)", id)
        await ctx.execSql("insert into contact_user (id) values (?)", id)
        await ctx.execSql('update contact_user set ? where id = ?', [data, id])

        // let result = await ctx.execSql('update contact_user set ? where id = ?', [data, userID]);  // 执行一下sql
        console.log("执行到了这个方法")
        ctx.body = {
            success: true,
            message: ''
        };
    } catch (err) {
        console.log(err)
        ctx.body = {
            success: false,
            message: err
        };
    }
}

// const getRandomNum = function (min, max, countNum) {
//     let arr = [];
//     // 在此处补全代码
//     function produceNum() {
//         let num = Math.floor((Math.random() * (max - min)) + min)
//         if (arr.indexOf(num) == -1) { //判断不存在就push
//             arr.push(num)
//         } else {
//             produceNum() //存在了重新调用
//         }
//         ;
//         if (arr.length < countNum) { //判断数组长度是否小于所需长度
//             produceNum();
//         }
//     }
//
//     produceNum()
//     return arr;
// };