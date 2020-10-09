import { codecs } from 'src/constants/codecs';

export class Profile {
	public name: string;
	public container: string = 'mkv';
	public vcodec: string = 'h.264';
	public vquality: string = 'medium';
	public passthrough: string[] = codecs.filter(codec => codec.lossless).map(codec => codec.value);
	public acodec: string = 'aac';
	public achannels: number = 2;
	public aquality: number = 0;
	public languages: string[] = [
		'eng'
	];
	public primaryLang: string = 'eng';
}