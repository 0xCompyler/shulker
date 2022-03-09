import os
from typing import List
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

from dotenv import load_dotenv
import requests


class SentimentScore:
    _key: str = ""
    _endpoint: str = ""
    _client: str = ""
    _comments: List = []
    _id: str = ""

    def __init__(self, aid) -> None:
        load_dotenv()

        self._key = os.getenv("TEXT_KEY")
        self._endpoint = os.getenv("TEXT_ENDPOINT")
        self._id = aid

        ta_credential = AzureKeyCredential(self._key)
        text_analytics_client = TextAnalyticsClient(
            endpoint=self._endpoint, credential=ta_credential
        )

        self._client = text_analytics_client

    def _fetch_comments(self):
        res = requests.get(self._id)
        if res.status_code != 200:
            return {"error": f"{res.status_code}"}

        results_json = res.json()

        for item in results_json["items"]:
            doc = item["snippet"]["topLevelComment"]["snippet"]
            self._comments.append(doc["textOriginal"])

    def analyze(self):
        self._fetch_comments()
        result = self._client.analyze_sentiment(
            self._comments[:10], show_opinion_mining=True
        )
        doc_result = [doc for doc in result if not doc.is_error]

        positive_reviews = [doc for doc in doc_result if doc.sentiment == "positive"]
        negative_reviews = [doc for doc in doc_result if doc.sentiment == "negative"]

        positive_mined_opinions = []
        mixed_mined_opinions = []
        negative_mined_opinions = []

        result_dict = {}
        result_dict["positive_score"] = []
        result_dict["neutral_score"] = []
        result_dict["negative_score"] = []
        result_dict["keywords"] = []

        for document in doc_result:
            result_dict["positive_score"].append(document.confidence_scores.positive)
            result_dict["neutral_score"].append(document.confidence_scores.neutral)
            result_dict["negative_score"].append(document.confidence_scores.negative)
            for sentence in document.sentences:
                for mined_opinion in sentence.mined_opinions:
                    target = mined_opinion.target
                    for assessment in mined_opinion.assessments:
                        result_dict["keywords"].append(assessment.text)

        result_dict["positive_score"] = sum(result_dict["positive_score"]) / len(
            result_dict["positive_score"]
        )
        result_dict["neutral_score"] = sum(result_dict["neutral_score"]) / len(
            result_dict["neutral_score"]
        )
        result_dict["negative_score"] = sum(result_dict["negative_score"]) / len(
            result_dict["negative_score"]
        )

        return result_dict


if __name__ == "__main__":
    url = "https://www.googleapis.com/youtube/v3/commentThreads?key=AIzaSyCr01yrmzx3WDqfWUsv-4aRtoYRxd5mDYw&textFormat=plainText&part=snippet&videoId=I4EWvMFj37g&maxResults=100&"
    sc = SentimentScore(url)
    print(sc.analyze())
