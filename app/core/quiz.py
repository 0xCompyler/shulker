from typing import Optional, Dict, Union

import itertools
import json
from typing import Optional, Dict, Union

from nltk import sent_tokenize

import torch
from transformers import (
    AutoModelForSeq2SeqLM,
    AutoTokenizer,
    PreTrainedModel,
    PreTrainedTokenizer,
)

from transformers import (
    AutoModelForSeq2SeqLM,
    AutoTokenizer,
    PreTrainedModel,
    PreTrainedTokenizer,
)

# import docx2txt


def pipeline(
    model: Optional = None,
    tokenizer: Optional[Union[str, PreTrainedTokenizer]] = None,
    qg_format: Optional[str] = "highlight",
    ans_model: Optional = None,
    ans_tokenizer: Optional[Union[str, PreTrainedTokenizer]] = None,
    use_cuda: Optional[bool] = True,
    **kwargs,
):

    model = "valhalla/t5-small-qg-hl"

    tokenizer = model

    if isinstance(tokenizer, (str, tuple)):
        if isinstance(tokenizer, tuple):
            # For tuple we have (tokenizer name, {kwargs})
            tokenizer = AutoTokenizer.from_pretrained(tokenizer[0], **tokenizer[1])
        else:
            tokenizer = AutoTokenizer.from_pretrained(tokenizer)

    # Instantiate model if needed
    if isinstance(model, str):
        model = AutoModelForSeq2SeqLM.from_pretrained(model)

    # load default ans model
    ans_model = "valhalla/t5-small-qa-qg-hl"
    ans_tokenizer = AutoTokenizer.from_pretrained(ans_model)
    ans_model = AutoModelForSeq2SeqLM.from_pretrained(ans_model)

    # Instantiate tokenizer if needed
    if isinstance(ans_tokenizer, (str, tuple)):
        if isinstance(ans_tokenizer, tuple):
            # For tuple we have (tokenizer name, {kwargs})
            ans_tokenizer = AutoTokenizer.from_pretrained(
                ans_tokenizer[0], **ans_tokenizer[1]
            )
        else:
            ans_tokenizer = AutoTokenizer.from_pretrained(ans_tokenizer)

    if isinstance(ans_model, str):
        ans_model = AutoModelForSeq2SeqLM.from_pretrained(ans_model)

    return QuestionGenerator(
        model=model,
        tokenizer=tokenizer,
        ans_model=ans_model,
        ans_tokenizer=ans_tokenizer,
        qg_format=qg_format,
        use_cuda=use_cuda,
    )


class QuestionGenerator:
    def __init__(
        self,
        model: PreTrainedModel,
        tokenizer: PreTrainedTokenizer,
        ans_model: PreTrainedModel,
        ans_tokenizer: PreTrainedTokenizer,
        qg_format: str,
        use_cuda: bool,
    ):
        self.model = model
        self.tokenizer = tokenizer

        self.ans_model = ans_model
        self.ans_tokenizer = ans_tokenizer

        self.qg_format = qg_format

        self.device = "cuda" if torch.cuda.is_available() and use_cuda else "cpu"
        self.model.to(self.device)

        if self.ans_model is not self.model:
            self.ans_model.to(self.device)

        assert self.model.__class__.__name__ in [
            "T5ForConditionalGeneration",
            "BartForConditionalGeneration",
        ]

        if "T5ForConditionalGeneration" in self.model.__class__.__name__:
            self.model_type = "t5"
        else:
            self.model_type = "bart"

    def __call__(self, inputs: str):
        inputs = " ".join(inputs.split())
        sents, answers = self._extract_answers(inputs)
        flat_answers = list(itertools.chain(*answers))

        if len(flat_answers) == 0:
            return []

        qg_examples = self._prepare_inputs_for_qg_from_answers_hl(sents, answers)

        qg_inputs = [example["source_text"] for example in qg_examples]
        questions = self._generate_questions(qg_inputs)

        output = []
        for ctr, question in enumerate(questions):
            temp_dict = {"question": question, "answer": qg_examples[ctr]["answer"]}
            output.append(temp_dict)
        return output

    def _generate_questions(self, inputs):
        inputs = self._tokenize(inputs, padding=True, truncation=True)

        outs = self.model.generate(
            input_ids=inputs["input_ids"].to(self.device),
            attention_mask=inputs["attention_mask"].to(self.device),
            max_length=32,
            num_beams=4,
        )

        questions = [
            self.tokenizer.decode(ids, skip_special_tokens=True) for ids in outs
        ]
        return questions

    def _extract_answers(self, context):
        sents, inputs = self._prepare_inputs_for_ans_extraction(context)
        inputs = self._tokenize(inputs, padding=True, truncation=True)

        outs = self.ans_model.generate(
            input_ids=inputs["input_ids"].to(self.device),
            attention_mask=inputs["attention_mask"].to(self.device),
            max_length=32,
        )

        dec = [
            self.ans_tokenizer.decode(ids, skip_special_tokens=False) for ids in outs
        ]
        answers = [item.split("<sep>") for item in dec]
        answers = [i[:-1] for i in answers]

        return sents, answers

    def _tokenize(
        self,
        inputs,
        padding=True,
        truncation=True,
        add_special_tokens=True,
        max_length=512,
    ):
        inputs = self.tokenizer.batch_encode_plus(
            inputs,
            max_length=max_length,
            add_special_tokens=add_special_tokens,
            truncation=truncation,
            padding="max_length" if padding else False,
            pad_to_max_length=padding,
            return_tensors="pt",
        )
        return inputs

    def _prepare_inputs_for_ans_extraction(self, text):
        sents = sent_tokenize(text)

        inputs = []
        for i in range(len(sents)):
            source_text = "extract answers:"
            for j, sent in enumerate(sents):
                if i == j:
                    sent = "<hl> %s <hl>" % sent
                source_text = "%s %s" % (source_text, sent)
                source_text = source_text.strip()

            if self.model_type == "t5":
                source_text = source_text + " </s>"
            inputs.append(source_text)

        return sents, inputs

    def _prepare_inputs_for_qg_from_answers_hl(self, sents, answers):
        inputs = []
        for i, answer in enumerate(answers):
            if len(answer) == 0:
                continue
            for answer_text in answer:
                sent = sents[i]
                sents_copy = sents[:]

                answer_text = answer_text.strip()
                answer_text = answer_text.replace("<pad> ", "")
                try:
                    # ans_start_idx = sent.index(answer_text)
                    ans_start_idx = sent.replace(" ", "").index(
                        answer_text.replace(" ", "")
                    )

                except Exception as e:

                    print(e, answer_text)

                sent = f"{sent[:ans_start_idx]} <hl> {answer_text} <hl> {sent[ans_start_idx + len(answer_text): ]}"
                sents_copy[i] = sent

                source_text = " ".join(sents_copy)
                source_text = f"generate question: {source_text}"
                if self.model_type == "t5":
                    source_text = source_text + " </s>"

                inputs.append({"answer": answer_text, "source_text": source_text})

        return inputs


QG = pipeline()
