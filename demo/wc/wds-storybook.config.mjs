import { fromRollup } from '@web/dev-server-rollup';
import rollupJson from '@rollup/plugin-json';

const json = fromRollup(rollupJson);

export default {
    appIndex: 'demo/wc/index.html',
    nodeResolve: true,
    watch: true,
    open: true,
    mimeTypes: {
        '**/*.json': 'js',
    },
    plugins: [
        json(),
    ],
};
