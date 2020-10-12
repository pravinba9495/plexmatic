import { codecs } from "src/constants/codecs";

export class Profile {
  public id?: number = 0;
  public name: string;
  public container: string = "mkv";
  public video: {
    codec: string;
    quality: string;
  } = {
    codec: "copy",
    quality: "medium",
  };
  public audio: {
    codec: string;
    channels: number;
    quality: number;
    passthrough: string[];
  } = {
    codec: "aac",
    channels: 2,
    quality: 0,
    passthrough: codecs
      .filter((codec) => codec.lossless)
      .map((codec) => codec.value),
  };
  public language: {
    wanted: string[];
    primary: string;
  } = {
    wanted: ["eng"],
    primary: "eng",
  };
}
