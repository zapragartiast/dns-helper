/*
████████████████████████████████████████████████████████████████████████████████████████████████████████
██                                                                                                    ██
██        _____   ______   __       __   ______   __              _______    ______   ________        ██
██       /     | /      \ /  \     /  | /      \ /  |            /       \  /      \ /        |       ██
██       $$$$$ |/$$$$$$  |$$  \   /$$ |/$$$$$$  |$$ |            $$$$$$$  |/$$$$$$  |$$$$$$$$/        ██
██          $$ |$$ |__$$ |$$$  \ /$$$ |$$ |__$$ |$$ |            $$ |__$$ |$$ |  $$ |   $$ |          ██
██     __   $$ |$$    $$ |$$$$  /$$$$ |$$    $$ |$$ |            $$    $$< $$ |  $$ |   $$ |          ██
██    /  |  $$ |$$$$$$$$ |$$ $$ $$/$$ |$$$$$$$$ |$$ |            $$$$$$$  |$$ |  $$ |   $$ |          ██
██    $$ \__$$ |$$ |  $$ |$$ |$$$/ $$ |$$ |  $$ |$$ |_____       $$ |__$$ |$$ \__$$ |   $$ |          ██
██    $$    $$/ $$ |  $$ |$$ | $/  $$ |$$ |  $$ |$$       |      $$    $$/ $$    $$/    $$ |          ██
██     $$$$$$/  $$/   $$/ $$/      $$/ $$/   $$/ $$$$$$$$/       $$$$$$$/   $$$$$$/     $$/   V5.0    ██
██                                                                                                    ██
██    Coded By: Jamal Bigballs                                                                        ██
██    Author URI: https://www.jamal-bigballs.dev/                                                     ██
██    License: GNU General Public License v2 or later                                                 ██
██    License URI: http://www.gnu.org/licenses/gpl-2.0.html                                           ██
██                                                                                                    ██
████████████████████████████████████████████████████████████████████████████████████████████████████████

    "Push yourself but don't push your luck"
    Jamal Bigball est.2022
*/

const { cover, color, crot, lookupDomain, parseWhoisData, format_string, getDNSRecords, checkDnsHistory, getDomainName, sakanigadik, addLine, setTerminalSize, censys } = require('./modules/Functions');
// const { scrape } = require('./modules/Puppeteer');


async function main() {
    try {
        console.clear();
        await setTerminalSize(66, 104);
        console.log(cover());

        let domain, choose = '';
        const arg = process.argv[2];
        const arg2 = process.argv[3];
        if(arg) {
            domain = arg;
        } else {
            domain = await crot('Enter your Domain: ');
        }
        domain = getDomainName(domain);

        if(!domain.trim()) {
            console.log(color('red', `Input your Domain/Hostname!`));
            await sakanigadik();
            process.exit();
        }
        
        console.log(color('green', `Your Domain/Hostname: ${domain}\n`));

        if(arg2) {
            choose = arg2;
        } else {
            console.log(color("white", format_string('[1] Whois', color("white", "[2] Get real IP behind Cloudflare"))));
            console.log(color("white", format_string('[3] Get DNS records', color("white", "[4] DNS History (Security Trails)\n"))));
            choose = await crot('Enter your input: ');
        }

        const validTypes = ["1", "2", "3", "4"];
        if (!validTypes.includes(choose)) {
            console.log(color('navy', '[JAMALBOT] ❱❱ ') + color('red', 'Invalid options\n'));
            await sakanigadik();
            process.exit();
        }

        console.log(color('green', `Your input: ${choose}`));
        console.log(color('navy', addLine(25)));

        if(choose === '1') {
            const data = await lookupDomain(domain);
            const parsedData = parseWhoisData(data);
    
            console.log(color('blue', 'Domain Information:'));
            console.log(color('blue', format_string('Domain Name', color("green", `: ${parsedData.domainName}`))));
            console.log(color('blue', format_string('Registrar', color("green", `: ${parsedData.registrar}`))));
            if(Array.isArray(parsedData.status)) {
                console.log(color('blue', format_string('Status', color("green", `: ${parsedData.status.join(', ')}`))));
            } else {
                console.log(color('blue', format_string('Status', color("green", `: ${parsedData.status}`))));
            }
            console.log(color('blue', format_string('DNSSEC', color("green", `: ${parsedData.dnssec}`))));
            console.log(color('blue', format_string('Expiration Date', color("green", `: ${parsedData.expirationDate}`))));
            console.log(color('blue', format_string('Name Servers', color("green", `: ${parsedData.nameServers.join(', ')}`))));
        }
        if(choose === '2') {
            console.log(color('yellow', 'Please wait...'));
            const result = await censys(domain);
            // const result = await scrape(`https://search.censys.io/search?resource=hosts&sort=RELEVANCE&per_page=25&virtual_hosts=EXCLUDE&q=${domain}`);
            console.log(color('navy', `Possible IPs: \n${color('green', result)}`));
        }
        if(choose === '3') {
            const dnsRecords = await getDNSRecords(domain);
            console.log(color('blue', format_string('NS Records', color("green", `: ${dnsRecords.ns}`))));
            console.log(color('blue', format_string('A Records', color("green", `: ${dnsRecords.a}`))));
            console.log(color('blue', format_string('MX Records', color("green", `: ${dnsRecords.mx}`))));
            console.log(color('blue', format_string('TXT Records', color("green", `: ${dnsRecords.txt}`))));
            console.log(color('blue', format_string('Glue Records', color("green", `: \n${dnsRecords.glue}`))));
        }
        if(choose === '4') {
            console.log(color('yellow', 'Please wait...'));
            const result = await checkDnsHistory(domain, "a");
            console.log(color('blue', format_string('DNS History', color("green", `: \n${result}`))));
        }
    } catch (error) {
        console.log(color('red', `An error occurred: ${error}`));
    }
    console.log(color('navy', addLine(25)));
}

main();