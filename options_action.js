#!/usr/bin/env node

const _ = require('lodash');
const Table = require('cli-table2');
const moment = require('moment');
const colors = require('colors/safe');
const marked = require('marked');
const shell = require('shelljs');
const chalk = require('chalk');
const fetch = require('./fetch_cnodejs');
const { rmUrlPrefixDoubleSlash } = require('./utils');

async function fetchList(tab, count) {
    const data = await fetch('/topics', { tab, limit: count, mdrender: false });
    const keys = ['id',
        'tab',
        'title',
        'last_reply_at',
        'top',
        'reply_count',
        'visit_count',
        'create_at'];

    // 输出表格
    const table = new Table({
        head: keys.map((i) => colors.cyan(i)),
    });
    data.data.forEach((element) => {
        // eslint-disable-next-line no-param-reassign
        element.last_reply_at = moment(element.last_reply_at).format('YYYY-MM-DD HH:mm:ss');
        // eslint-disable-next-line no-param-reassign
        element.create_at = moment(element.create_at).format('YYYY-MM-DD HH:mm:ss');
        let ellipsis = '';
        if (element.title.length > 45) {
            ellipsis = '...';
        }
        // eslint-disable-next-line no-param-reassign
        element.title = `${element.title.substring(0, 45)}${ellipsis}`;
        table.push(Object.values(_.pick(element, keys)));
    });
    console.log(table.toString());
}

async function fetchDetail(id) {
    const data = await fetch(`/topic/${id}`, { mdrender: false });
    // eslint-disable-next-line camelcase
    const { replies, author: { loginname, avatar_url } } = data.data;
    let { content } = data.data;
    content = marked(content).match(/(.{1,120})/g);
    content = content.map((str) => _.padEnd(str, ' ', 120)).join('\n');
    data.data.last_reply_at = moment(data.data.last_reply_at).format('YYYY-MM-DD HH:mm:ss');
    data.data.create_at = moment(data.data.create_at).format('YYYY-MM-DD HH:mm:ss');
    data.data.loginname = loginname;
    // eslint-disable-next-line camelcase
    data.data.avatar_url = rmUrlPrefixDoubleSlash(avatar_url);
    delete data.data.content;
    delete data.data.replies;
    delete data.data.author;

    // 输出 info 表格
    const table = new Table({});
    const entries = Object.entries(data.data);
    entries.forEach((arr) => {
        // eslint-disable-next-line no-param-reassign
        arr[0] = chalk.blue(arr[0]);
    });
    entries.push([chalk.blue('url'), `https://cnodejs.org/topic/${id}`]);
    table.push([{ hAlign: 'center', colSpan: 4, content: colors.cyan('info') }]);
    // table.push(...entries);
    table.push(
        [...entries[0], ...entries[1]],
        [...entries[2], ...entries[3]],
        [...entries[4], ...entries[5]],
        [...entries[6], ...entries[7]],
        [...entries[8], ...entries[9]],
        [...entries[10], ...entries[11]],
        [...entries[12], ...entries[13]],
    );
    console.log(table.toString());

    // console.log('\n');
    const tableOfContent = new Table({});
    tableOfContent.push([{ hAlign: 'center', content: colors.cyan('正文') }]);
    tableOfContent.push([content]);
    console.log(tableOfContent.toString());
    // console.log(content);
    // console.log('\n');

    if (replies && replies.length > 0) {
        const keys = [
            'avatar_url',
            'loginname',
            'content',
            'upsCount',
            'create_at',
        ];

        // 评论表格
        const tableOfComment = new Table({
            head: [],
        });

        tableOfComment.push([{ hAlign: 'center', colSpan: 5, content: colors.cyan('评论') }]);
        tableOfComment.push(['头像', '用户名称', '评论内容', '点赞数量', '添加时间'].map((i) => chalk.blue(i)));

        replies.forEach((item) => {
            // eslint-disable-next-line no-param-reassign
            item.loginname = item.author.loginname;
            // eslint-disable-next-line no-param-reassign
            item.avatar_url = rmUrlPrefixDoubleSlash(item.author.avatar_url);
            // eslint-disable-next-line no-param-reassign
            item.content = item.content.match(/(.{1,30})/g).join('\n');
            // eslint-disable-next-line no-param-reassign
            item.upsCount = item.ups.length;
            // eslint-disable-next-line no-param-reassign
            item.create_at = moment(item.create_at).format('YYYY-MM-DD HH:mm:ss');
            tableOfComment.push(Object.values(_.pick(item, keys)));
        });
        console.log(tableOfComment.toString());
    }
}

module.exports = {
    fetchList,
    fetchDetail,
};
