declare module 'quill-image-resize-module-react' {
    import { Quill } from 'quill';

    export interface ImageResizeOptions {
        modules?: any;
        handles?: string[];
        displayStyles?: any;
    }

    export default class ImageResize {
        constructor(quill: Quill, options: ImageResizeOptions);
    }
}
