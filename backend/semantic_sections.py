from sentence_transformers import SentenceTransformer, util
import numpy as np
import re

# Load embedding model (MiniLM or MPNet)
model = SentenceTransformer("all-mpnet-base-v2")

# Multi-sentence semantic descriptions for each resume section
SECTION_LABELS = {
    "education": [
        "This paragraph describes a person's academic background.",
        "It may list universities, degrees, majors, minors, or coursework.",
        "It may reference formal study, institutions, or educational programs.",
        "Typical content includes dates of study, academic achievements, or fields of study."
    ],

    "experience": [
        "This paragraph describes a person's work experience or employment history.",
        "It may include job titles, responsibilities, tasks, achievements, or leadership roles.",
        "It may reference organizations, teams, contributions, or workplace activities.",
        "Internships, teaching duties, and part-time work also belong here."
    ],

    "projects": [
        "This paragraph describes technical or academic projects.",
        "It may mention software implementations, research projects, or system development.",
        "It often includes tools used, outcomes achieved, or problem-solving approaches.",
        "Projects can be academic, personal, or professional in nature."
    ],

    "skills": [
        "This paragraph contains a list of technical skills or proficiencies.",
        "It usually includes programming languages, frameworks, or tools.",
        "It is often formatted as a short list rather than long sentences.",
        "Examples: Python, SQL, Git, C++, Machine Learning, FastAPI."
    ],

    "awards": [
        "This paragraph lists awards, honors, medals, or achievements.",
        "It may reference scholarships, competitions, or notable distinctions.",
        "It may include rankings, placements, or recognitions received.",
        "Awards can be academic, professional, or extracurricular."
    ],

    "summary": [
        "This paragraph is a professional summary or career objective.",
        "It describes the person's background at a high level.",
        "It highlights key strengths, interests, or goals.",
        "It is usually found at the top of a resume."
    ],
}

# Compute averaged embeddings for each label
SECTION_EMB = {}
for label, desc_list in SECTION_LABELS.items():
    embeddings = [model.encode(desc) for desc in desc_list]
    SECTION_EMB[label] = np.mean(embeddings, axis=0)  # average embedding


def split_into_paragraphs(text: str):
    raw_lines = [l.rstrip() for l in text.split("\n")]

    paragraphs = []

    for line in raw_lines:
        clean = line.strip()

        # skip empty visual lines but preserve separation
        if clean == "":
            continue

        # ALL CAPS headers → separate paragraph
        if clean.isupper() and len(clean.split()) <= 4:
            paragraphs.append(clean)
            continue

        # Bullets are always separate micro-paragraphs
        if clean.startswith(("•", "-", "*", "●", "▪", "·", "–", "—")):
            paragraphs.append(clean)
            continue

        # Role/title detection (Leader..., Teacher..., Engineer...)
        if re.match(r"^[A-Z][a-zA-Z]+.*(,|\bat\b|\bof\b|\bfor\b)", clean):
            paragraphs.append(clean)
            continue

        # Default: treat each line as its own micro-paragraph
        paragraphs.append(clean)

    return paragraphs


def semantic_section_detection(text: str):
    paragraphs = split_into_paragraphs(text)
    results = {label: [] for label in SECTION_LABELS.keys()}

    for p in paragraphs:
        emb = model.encode(p)
        best_label = None
        best_score = -1

        for label, label_emb in SECTION_EMB.items():
            score = util.cos_sim(emb, label_emb).item()
            if score > best_score:
                best_score = score
                best_label = label

        # Confidence threshold
        if best_score >= 0.28:
            results[best_label].append(p)

    # Remove empty labels
    return {label: "\n\n".join(content) for label, content in results.items() if content}
