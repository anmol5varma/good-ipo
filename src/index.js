import main from './main.js';
import { printOutput } from './utils.js'

main()
.then(data => data.map(({ last_update, ...o }) => o))
.then(printOutput).catch((err) => {
    console.error(err);
    process.exit(1);
});
