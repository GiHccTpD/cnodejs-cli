#!/usr/bin/env node

const Commander = require('commander'); // include commander in git clone of commander repo
const marked = require('marked');
const TerminalRenderer = require('marked-terminal');
const { fetchList, fetchDetail } = require('./options_action');

const program = new Commander.Command();

program
    .option('-d, --debug', 'Output debug info')
    .option('-l, --list', 'topics list')
    .option('-t, --tab <tabName>', 'tab list', 'all')
    .option('-c, --count <limitCount>', 'Number of topics per page', 10)
    .option('-s, --detail <topicId>', 'article details')
    .version('0.0.1')
    .usage('cnodecli <cmd> [param]');

program.parse(process.argv);

// markdown 渲染配置
marked.setOptions({
    // Define custom renderer
    renderer: new TerminalRenderer(),
});

if (program.debug) {
    console.log(program.opts());
}
if (program.list) {
    fetchList(program.tab, program.count);
}

if (program.detail) {
    fetchDetail(program.detail);
}
