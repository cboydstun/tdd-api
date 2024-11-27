import { modules, formats } from '../QuillConfig';

describe('QuillConfig', () => {
    describe('modules', () => {
        it('has toolbar configuration', () => {
            expect(modules.toolbar).toBeDefined();
            expect(Array.isArray(modules.toolbar)).toBe(true);
        });

        it('includes header options', () => {
            const headerConfig = modules.toolbar[0][0] as { header: (number | boolean)[] };
            expect(headerConfig).toHaveProperty('header');
            expect(headerConfig.header).toEqual([1, 2, 3, 4, 5, 6, false]);
        });

        it('includes text formatting options', () => {
            const textFormatting = modules.toolbar[1] as string[];
            expect(textFormatting).toEqual(['bold', 'italic', 'underline', 'strike']);
        });

        it('includes list options', () => {
            const listOptions = modules.toolbar[2] as Array<{ list: string }>;
            expect(listOptions).toEqual([
                { list: 'ordered' },
                { list: 'bullet' }
            ]);
        });

        it('includes script options', () => {
            const scriptOptions = modules.toolbar[3] as Array<{ script: string }>;
            expect(scriptOptions).toEqual([
                { script: 'sub' },
                { script: 'super' }
            ]);
        });

        it('includes indentation options', () => {
            const indentOptions = modules.toolbar[4] as Array<{ indent: string }>;
            expect(indentOptions).toEqual([
                { indent: '-1' },
                { indent: '+1' }
            ]);
        });

        it('includes direction options', () => {
            const directionOptions = modules.toolbar[5] as Array<{ direction: string }>;
            expect(directionOptions).toEqual([
                { direction: 'rtl' }
            ]);
        });

        it('includes color options', () => {
            const colorOptions = modules.toolbar[6] as Array<{ color: never[] } | { background: never[] }>;
            expect(colorOptions).toEqual([
                { color: [] },
                { background: [] }
            ]);
        });

        it('includes media options', () => {
            const mediaOptions = modules.toolbar[7] as string[];
            expect(mediaOptions).toEqual(['link', 'image', 'video']);
        });

        it('includes clean option', () => {
            const cleanOption = modules.toolbar[8] as string[];
            expect(cleanOption).toEqual(['clean']);
        });

        it('has correct number of toolbar options', () => {
            expect(modules.toolbar).toHaveLength(9);
        });
    });

    describe('formats', () => {
        const expectedFormats = [
            'header',
            'bold',
            'italic',
            'underline',
            'strike',
            'list',
            'bullet',
            'script',
            'indent',
            'direction',
            'color',
            'background',
            'link',
            'image',
            'video'
        ];

        it('includes all required formats', () => {
            expectedFormats.forEach(format => {
                expect(formats).toContain(format);
            });
        });

        it('has no extra formats', () => {
            expect(formats).toHaveLength(expectedFormats.length);
            formats.forEach(format => {
                expect(expectedFormats).toContain(format);
            });
        });

        it('maintains format order', () => {
            expect(formats).toEqual(expectedFormats);
        });
    });
});
