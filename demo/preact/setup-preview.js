/* eslint-disable import/no-unresolved */
import { registerPreviewEntry, configure } from '../../preact.js';
import * as preview from './preview.js';
import * as ButtonStories from './stories/Button.stories.js';

registerPreviewEntry(preview);

configure(() => [ButtonStories], {}, false);
