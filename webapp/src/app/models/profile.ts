export class Profile {
	public name: string;
	public container: string = 'mkv';
	public vcodec: string = 'h.264';
	public vquality: string = 'medium';
	public passthrough: string[] = [
		'truehd',
		'dtshd',
		'flac',
	];
	public acodec: string = 'aac';
	public aquality: number = 128;
	public languages: string[] = [
		'eng'
	];
	public primaryLang: string = 'eng';
	public subtitles: boolean = true;
}