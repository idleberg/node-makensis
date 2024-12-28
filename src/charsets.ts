import { codepages } from '@nsis/language-data';

const codePages: string[] = codepages().map((cp: number) => `CP${cp}`);

export const input = ['ACP', ...codePages, 'OEM', 'UTF8', 'UTF16BE', 'UTF16LE'] as const;

export const output = [
	'ACP',
	...codePages,
	'OEM',
	'UTF16BE',
	'UTF16BEBOM',
	'UTF16LE',
	'UTF16LEBOM',
	'UTF8',
	'UTF8SIG',
] as const;
