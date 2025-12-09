import re

SECTION_HEADERS = [
    "education",
    "experience",
    "work experience",
    "projects",
    "skills",
    "technical skills",
    "summary",
    "about me",
    "certifications",
]

def extract_sections(text: str):
    """
    Split resume text into sections based on common headers.
    Returns a dictionary {section_name: section_text}
    """

    sections = {}
    lower_text = text.lower()

    # Build regex pattern like "(education|skills|projects):"
    pattern = r"(?P<header>" + "|".join(SECTION_HEADERS) + r")[:\n]"

    matches = list(re.finditer(pattern, lower_text))

    if not matches:
        return {"full_text": text}

    for i, match in enumerate(matches):
        header = match.group("header")

        start = match.end()

        # Determine end of this section
        if i < len(matches) - 1:
            end = matches[i + 1].start()
        else:
            end = len(text)

        section_text = text[start:end].strip()
        sections[header] = section_text

    return sections
