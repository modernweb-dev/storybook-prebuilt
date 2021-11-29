/* eslint-disable import/no-unresolved */
import { registerPreviewEntry, configure } from '../../web-components.js';
import * as preview from './preview.js';
import * as ButtonStories from './stories/Button.stories.js';
import * as CustomButtonStories from './stories/CustomButton.stories.js';

registerPreviewEntry(preview);

configure(() => [ButtonStories, CustomButtonStories], {}, false);
