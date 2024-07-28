const readline = require('readline');
const whois = require('whois');
const { exec } = require('child_process');
const axios = require('axios');
const { table } = require('table');
var ini = require('ini');
const fs = require("fs");

var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));


function getDomainName(inputUrl) {
    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
        return inputUrl;
    }
    
    const parsedUrl = new URL(inputUrl);
    return parsedUrl.hostname;
}

function lookupDomain(domain) {
    return new Promise((resolve, reject) => {
        whois.lookup(domain, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function parseWhoisData(data) {
    const lines = data.split('\n');
    const info = {
        domainName: '',
        registrar: '',
        status: [],
        nameServers: [],
        dnssec: '',
        expirationDate: ''
    };
    
    lines.forEach(line => {
        if (line.startsWith('Domain Name:')) {
            info.domainName = line.split(':')[1].trim();
        } else if (line.startsWith('Sponsoring Registrar Organization:')) {
            info.registrar = line.split(':')[1].trim();
        } else if (line.startsWith('Registrant Organization:')) {
            info.registrar = line.split(':')[1].trim();
        } else if (line.startsWith('Status:')) {
            info.status = line.split(':')[1].trim();
        } else if (line.startsWith('Domain Status:')) {
            let item = line.split(':')[1].trim();
            const parts = item.split(' ');

            info.status.push(parts.slice(0, -1));
        } else if (line.startsWith('Name Server:')) {
            info.nameServers.push(line.split(':')[1].trim());
        } else if (line.startsWith('DNSSEC:')) {
            info.dnssec = line.split(':')[1].trim();
        } else if (line.startsWith('Expiration Date:')) {
            info.expirationDate = line.split(':')[1].trim();
        } else if (line.startsWith('Registrar Registration Expiration Date:')) {
            info.expirationDate = line.split(':')[1].trim();
        }
        
    });

    return info;
}

function dd(data) {
    console.log(data);
    process.exit();
}

function color(color = 'random', text) {
    const colors = {
        grey: '1;30',
        red: '1;31',
        green: '1;32',
        yellow: '1;33',
        blue: '1;34',
        purple: '1;35',
        navy: '1;36',
        cyan: '0;36',
        white: '1;1',
        bgred: '1;41',
        bggreen: '1;42',
        bgyellow: '1;43',
        bgblue: '1;44',
        bgpurple: '1;45',
        bgnavy: '1;46',
        bgwhite: '1;47'
    };
    return `\x1b[${colors[color]}m${text}\x1b[0m`;
}

async function crot(msg) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(color('navy', '[JAMALBOT] ❱❱ ') + color('purple', msg), ans => {
        rl.close();
        resolve(ans);
    }));
}

function format_string(text = '', status_data = '') {
    const s = 25;
    let data = text.padEnd(s, ' ');
    return `${data} ${status_data}`;
}

function parseStr(string, start, end) {
    const str = string.split(start)[1].split(end)[0];
    return str;
}

function cover() {
    let template = color('blue', `████████████████████████████████████████████████████████████████████████████████████████████████████████\n`);
    template += color('blue', `██                                                                                                    ██\n`);
    template += color('blue', `██    ${color('purple', '    _____   ______   __       __   ______   __              _______    ______   ________ ')}       ${color('blue', '██')}\n`);
    template += color('blue', `██    ${color('purple', '   /     | /      \\ /  \\     /  | /      \\ /  |            /       \\  /      \\ /        |')}       ${color('blue', '██')}\n`);
    template += color('blue', `██    ${color('purple', '   $$$$$ |/$$$$$$  |$$  \\   /$$ |/$$$$$$  |$$ |            $$$$$$$  |/$$$$$$  |$$$$$$$$/')}        ${color('blue', '██')}\n`);
    template += color('blue', `██    ${color('purple', '      $$ |$$ |__$$ |$$$  \\ /$$$ |$$ |__$$ |$$ |            $$ |__$$ |$$ |  $$ |   $$ |')}          ${color('blue', '██')}\n`);
    template += color('blue', `██    ${color('purple', ' __   $$ |$$    $$ |$$$$  /$$$$ |$$    $$ |$$ |            $$    $$< $$ |  $$ |   $$ |')}          ${color('blue', '██')}\n`);
    template += color('blue', `██    ${color('purple', '/  |  $$ |$$$$$$$$ |$$ $$ $$/$$ |$$$$$$$$ |$$ |            $$$$$$$  |$$ |  $$ |   $$ |')}          ${color('blue', '██')}\n`);
    template += color('blue', `██    ${color('purple', '$$ \\__$$ |$$ |  $$ |$$ |$$$/ $$ |$$ |  $$ |$$ |_____       $$ |__$$ |$$ \\__$$ |   $$ |')}          ${color('blue', '██')}\n`);
    template += color('blue', `██    ${color('purple', '$$    $$/ $$ |  $$ |$$ | $/  $$ |$$ |  $$ |$$       |      $$    $$/ $$    $$/    $$ |')}          ${color('blue', '██')}\n`);
    template += color('blue', `██    ${color('purple', ' $$$$$$/  $$/   $$/ $$/      $$/ $$/   $$/ $$$$$$$$/       $$$$$$$/   $$$$$$/     $$/')}   V5.0    ${color('blue', '██')}\n`);
    template += color('blue', `██                                                                                                    ██\n`);
    template += color('blue', `██    ${color('navy', 'Coded By: ')}${color('red', 'Jamal Bigballs')}                                                                        ${color('blue', '██')}\n`);
    template += color('blue', `██    ${color('navy', 'Author URI: ')}${color('yellow', 'https://www.jamal-bigballs.dev/')}                                                     ${color('blue', '██')}\n`);
    template += color('blue', `██    ${color('navy', 'License: ')}${color('blue', 'GNU General Public License v2 or later')}                                                 ${color('blue', '██')}\n`);
    template += color('blue', `██    ${color('navy', 'License URI: ')}${color('green', 'http://www.gnu.org/licenses/gpl-2.0.html')}                                           ${color('blue', '██')}\n`);
    template += color('blue', `██                                                                                                    ██\n`);
    template += color('blue', `████████████████████████████████████████████████████████████████████████████████████████████████████████\n`);
    return `${template}\n`;
}

function showStatus(done, total, size = 30) {
    if (done > total) return;

    const start_time = Date.now();
    const now = Date.now();
    const perc = done / total;
    const bar = Math.floor(perc * size);
    let status_bar = color('blue', '\r[');
    status_bar += color('purple', '=').repeat(bar);
    if (bar < size) {
        status_bar += color('blue', '>');
        status_bar += ' '.repeat(size - bar);
    } else {
        status_bar += color('purple', '=');
    }
    const disp = (perc * 100).toFixed(0);
    status_bar += color('blue', `] ${disp}%  ${done}/${total}`);
    const rate = (now - start_time) / done;
    const left = total - done;
    const eta = Math.round(rate * left);
    const elapsed = now - start_time;
    status_bar += color('blue', ` remaining: ${eta.toFixed(0)} sec. elapsed: ${elapsed.toFixed(0)} sec.`);
    process.stdout.write(`${status_bar}  \n`);
    if (done === total) {
        process.stdout.write('\n');
    }
}

function parseDigOutput(output, recordType) {
    const lines = output.split('\n');
    const records = [];
    lines.forEach(line => {
        if (line.includes(recordType) && !line.startsWith(';')) {
            const parts = line.trim().split(/\s+/);
            if (recordType === 'MX') {
                records.push(`${parts[parts.length - 2]} ${parts[parts.length - 1]}`);
            } else if (recordType === 'TXT') {
                records.push(parts.slice(4).join(' '));
            } else {
                records.push(parts[parts.length - 1]);
            }
        }
    });
    return records;
}

function dig(domain, recordType) {
    return new Promise((resolve, reject) => {
        exec(`dig ${recordType} ${domain}`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${stderr}`);
            } else {
                const records = parseDigOutput(stdout, recordType);
                resolve(records);
            }
        });
    });
}

async function getGlueRecords(nsRecords) {
    const glueRecords = {};
    for (const ns of nsRecords) {
        glueRecords[ns] = await dig(ns, 'A');
    }
    const flattenedData = Object.entries(glueRecords).flatMap(([nameServer, ips]) => {
        return ips.map(ip => ({
          nameServer,
          ip
        }));
      });
      
      const dataTable = [
        ['Name Server', 'IP Address'], // table headers
        ...flattenedData.map(row => [row.nameServer, row.ip])
      ];
      return table(dataTable);
}

async function getDNSRecords(domain) {
    try {
        const nsRecords = await dig(domain, 'NS');
        const aRecords = await dig(domain, 'A');
        const mxRecords = await dig(domain, 'MX');
        const txtRecords = await dig(domain, 'TXT');
        const glueRecords = await getGlueRecords(nsRecords);

        return {
            ns: nsRecords,
            a: aRecords,
            mx: mxRecords,
            txt: txtRecords,
            glue: glueRecords
        };
    } catch (error) {
        console.error(error);
    }
}

async function checkDnsHistory(domain, type) {

    const url = `https://api.securitytrails.com/v1/history/${domain}/dns/${type}`;
    const headers = {
        "Accept": "application/json",
        "APIKEY": config.bot.security_trails,
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
    };

    try {
        const response = await axios.get(url, { headers });
        if (response.status === 200) {
            const jsonData = response.data.records;


            const flattenedData = jsonData.map(item => {
                const { first_seen, last_seen, organizations, type, values } = item;
                const organization = organizations.join(', ');
              
                return values.map(value => ({
                  first_seen,
                  last_seen,
                  organization,
                  type,
                  ip: value.ip,
                  ip_count: value.ip_count
                }));
              }).flat();
              
              const dataTable = [
                ['First Seen', 'Last Seen', 'Organization', 'Type', 'IP', 'IP Count'],
                ...flattenedData.map(row => [row.first_seen, row.last_seen, row.organization, row.type, row.ip, row.ip_count])
              ];
              return table(dataTable);
        } else {
            return `Error: Unable to fetch DNS history (Status code: ${response.status})`;
        }
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

async function censys(hostname) {
    const options = {
        method: 'GET',
        url: `https://search.censys.io/api/v2/hosts/search?q=${hostname}&per_page=50&virtual_hosts=EXCLUDE`,
        headers: {
          'Accept': '*/*',
          'Authorization': `Basic ${config.bot.censys}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
        },
        timeout: 30000
      };
    
    try {
        const response = await axios(options);
        const jsonData = response.data;
        const extractedData = jsonData.result.hits.map(hit => ({
            ip: hit.ip,
            as_name: hit.autonomous_system.name
        }));
        const dataTable = [
            ['IP Address', 'ASN'],
            ...extractedData.map(row => [row.ip, row.as_name])
        ];

        return table(dataTable);
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
    }
}

async function sakanigadik() {
    const open = await import('open');
    const urlToOpen = 'https://www.youtube.com/watch?v=zhciw9OZTM8';
    await open.default(urlToOpen);
}

module.exports = {
    dd,
    color,
    crot,
    format_string,
    parseStr,
    cover,
    showStatus,
    lookupDomain,
    getDNSRecords,
    checkDnsHistory,
    parseWhoisData,
    getDomainName,
    sakanigadik,
    censys
};