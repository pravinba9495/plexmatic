export const codecs: { label: string; value: string; lossless: boolean; }[] = [
	{ label: 'Dolby TrueHD', value: 'truehd', lossless: true },
	{ label: 'DTS-HD MA', value: 'dtshd', lossless: true },
	{ label: 'FLAC', value: 'flac', lossless: true },
	{ label: 'Dolby Digital (AC3)', value: 'ac3', lossless: false },
	{ label: 'Dolby Digital Plus (EAC3)', value: 'eac3', lossless: false },
	{ label: 'DTS', value: 'dts', lossless: false },
	{ label: 'AAC', value: 'aac', lossless: false },
];