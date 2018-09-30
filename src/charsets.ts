import { meta } from '@nsis/language-data';

const codePages: string[] = [];

Object.keys(meta).forEach( (key, index) => {
  let codePage = meta[key].code_page;

  if (!isNaN(codePage) && !codePages.includes(`CP${codePage}`)) {
    codePages.push(`CP${codePage}`);
  }
});

const input: string[] = [
  'ACP',
  ...codePages,
  'OEM',
  'UTF8',
  'UTF16BE',
  'UTF16LE'
];

const output: string[] = [
  'ACP',
  ...codePages,
  'OEM',
  'UTF16BE',
  'UTF16BEBOM',
  'UTF16LE',
  'UTF16LEBOM',
  'UTF8',
  'UTF8SIG'
];

export {
  input,
  output
};
