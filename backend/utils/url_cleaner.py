import re

def clean_url(url):
    """
    Cleans the URL by removing the scheme (http, https) and default port.
    """
    clean_url = re.sub(r'^https?://', '', url)
    if ':' not in clean_url:
        clean_url = f"{clean_url}:443"
    return clean_url
