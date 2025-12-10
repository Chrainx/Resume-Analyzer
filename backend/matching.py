from sentence_transformers import SentenceTransformer, util
import numpy as np
import math
from skills import SKILL_LIST

model = SentenceTransformer("all-mpnet-base-v2")

SKILL_EMB = {skill: model.encode(skill) for skill in SKILL_LIST}

# ----------------------------
# Softer logistic curve
# ----------------------------
def logistic_scale(x):
    return float(100 / (1 + math.exp(-6 * (x - 0.50))))


def extract_required_skills(job_description: str):
    jd_emb = model.encode(job_description)
    required = []

    for skill, emb in SKILL_EMB.items():
        sim = util.cos_sim(jd_emb, emb).item()
        if sim > 0.43:  # slightly more inclusive
            required.append(skill)

    return required


def extract_resume_skills(resume_text: str):
    lower = resume_text.lower()
    return [skill for skill in SKILL_LIST if skill in lower]


def compute_match(resume_text: str, job_description: str):

    paragraphs = [p.strip() for p in resume_text.split("\n") if len(p.strip()) > 20]
    if not paragraphs:
        return 0.0

    resume_embs = model.encode(paragraphs)
    jd_emb = model.encode(job_description)

    sims = util.cos_sim(resume_embs, jd_emb).cpu().numpy().flatten()

    top_k = sorted(sims, reverse=True)[:3]
    avg_sim = float(np.mean(top_k))

    # --- semantic similarity scaled ---
    semantic_score = logistic_scale(avg_sim)

    # --- skill matching ---
    required = extract_required_skills(job_description)
    resume_skills = extract_resume_skills(resume_text)

    if required:
        matched = sum(1 for s in required if s in resume_skills)
        skill_score = float((matched / len(required)) * 100)
    else:
        skill_score = 0.0

    # Increase skill weight from 30% → 40%
    final = float(0.60 * semantic_score + 0.40 * skill_score)

    return round(min(final, 100.0), 2)
