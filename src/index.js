const fs = require('fs');
const request = require('./request');

const MAX_COUNT_IN_REQUEST = 20;  // максимальное количество в запросе
const REQUIRED_TYPE = 'mini_app';  // нужный тип приложений

let miniApps = [];
const apps = fs.readFileSync(`${__dirname}/data/data.csv`)
    .toString()
    .split('\r\n')
    .map((app) => {
        const info = app.split(',');
        return {
            id: Number(info[0]),
            type: info[1],
            name: info.slice(3).reduce((a, x) => `${a},${x}`, info[2]),
        };
    })
    .filter((x) => x.id !== 0);

(async function() {
    let list = [];

    for (let i = 0; i < apps.length + 1; i++) {
        if (list.length < 20 && i !== apps.length) {
            list.push(apps[i].id);
        } else {
            console.log(`On item #${i} we take request`)
            const info = await request('apps.get', { app_ids: list.join(',') });
            for (let j = 0; j < info.items.length; j++) {
                if (info.items[j].type === 'mini_app') {
                    miniApps.push(info.items[j].id);
                }
            }

            list = [];
        }
    }

    let result = 'id,type,name\r\n';
    miniApps = apps.filter((x) => miniApps.includes(x.id))
    for (let i = 0; i < miniApps.length; i++) {
        result += `${miniApps[i].id},${miniApps[i].type},${miniApps[i].name}\r\n`;
    }

    fs.writeFileSync(`${__dirname}/data/result.csv`, result);
})();