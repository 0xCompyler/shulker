import logging
import azure.cognitiveservices.speech as speechsdk
from azure.storage.blob import (
    BlobServiceClient,
    BlobClient,
    ContainerClient,
    generate_blob_sas,
)
import json
import dotenv
import os
import youtube_dl


class SpeechUtils:
    _current_dir: str = os.getcwd()
    _storage_connection_string: str = ""

    _audio_path_wav: str
    _audio_path_webm: str

    _region: str = ""
    _key: str = ""
    _video_url: str
    _video_id: str

    def _audio_path_setter(self):
        self._audio_path_wav: str = os.path.join(
            self._current_dir, f"dump/{self._video_id}.wav"
        )
        self._audio_path_webm: str = os.path.join(
            self._current_dir, f"dump/{self._video_id}.webm"
        )

    def __init__(self) -> None:
        dot_env_path = os.path.join(self._current_dir, ".env")
        dotenv.load_dotenv()

        self._region = os.getenv("REGION")
        self._key = os.getenv("API_KEY")
        self._storage_connection_string = os.getenv("CONNECTION_STRING")

    def download_audio(self, youtube_url: str):
        self._video_url = youtube_url
        self._video_id = self._video_url.split("=")[-1]

        self._audio_path_setter()
        ydl_opts = {
            "format": "worstaudio",
            "extractaudio": True,
            "audioformat": "mp3",
            "outtmpl": self._audio_path_webm,
            "postprocessors": [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "wav",
                    "preferredquality": "96",
                }
            ],
        }
        with youtube_dl.YoutubeDL(ydl_opts) as ytdl:
            ytdl.cache.remove()
            ytdl.download([youtube_url])

    def audio_to_blob(self):
        print("[azure-blob] Uploading")
        blob_service_client = BlobServiceClient.from_connection_string(
            self._storage_connection_string
        )
        blob_client = blob_service_client.get_blob_client(
            container="shulker", blob=f"audio/{self._video_id}.wav"
        )
        with open(self._audio_path_wav, "rb") as data:
            blob_client.upload_blob(data)

        sas = generate_blob_sas(
            account_name="aquafilestorage",
            account_key=self._key,
            container_name="shulker",
            blob_name=f"audio/{self._video_id}.wav",
        )
        print(sas)

        return blob_client.url

    def transcribe(self):
        speech_config = speechsdk.SpeechConfig(
            subscription=self._key, region=self._region
        )
        speech_config.output_format = speechsdk.OutputFormat.Detailed

        speech_config.request_word_level_timestamps()
        audio_config = speechsdk.audio.AudioConfig(filename=self._audio_path_wav)

        speech_recognizer = speechsdk.SpeechRecognizer(
            speech_config=speech_config, language="en-US", audio_config=audio_config
        )

        result = speech_recognizer.recognize_once()
        transcription = {}
        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            json_result = json.loads(result.json)
            best_element = sorted(
                json_result["NBest"], key=lambda x: x["Confidence"], reverse=True
            )[0]

            speech = []
            for word in best_element["Words"]:
                start = word["Offset"] / 10000
                duration = word["Duration"] / 100000
                word_dict = {
                    "text": word["Word"],
                    "token": word["Word"],
                    "start": start,
                    "end": start + duration,
                }
                speech.append(word_dict)

            word_level = {
                "speaker": "main",
                "sentences": [best_element["Lexical"]],
                "speech": speech,
            }

            transcription["media"] = ""
            transcription["speakers"] = ["main"]
            transcription["turns"] = [word_level]

            return transcription

        elif result.reason == speechsdk.ResultReason.NoMatch:
            return {
                "error": "No speech could be recognized: {}".format(
                    result.no_match_details
                )
            }

        elif result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = result.cancellation_details
            return {
                "error": "Speech Recognition canceled: {}".format(
                    cancellation_details.reason
                )
            }


# su = SpeechUtils()
# su.download_audio("https://www.youtube.com/watch?v=I4EWvMFj37g&t=24s")
# su.transcribe()
speech_utils = SpeechUtils()

if __name__ == "__main__":
    speech_utils = SpeechUtils()
    speech_utils.download_audio("https://www.youtube.com/watch?v=iqlH4okiQqg")
    url = speech_utils.audio_to_blob()
    print(url)
