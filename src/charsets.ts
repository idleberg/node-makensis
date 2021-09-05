import { codepages } from '@nsis/language-data';

const codePages: string[] = codepages().map((cp: number) => `CP${cp}`);

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
